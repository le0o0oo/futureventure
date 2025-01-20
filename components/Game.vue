<script lang="ts" setup>
import * as BABYLON from "babylonjs";
import * as gameState from "~/stores/engine";
import funcs from "~/utils/generalFuncs";
import "babylonjs-loaders";
import { eventBus } from "~/event-bus";
import utilsMeshes from "~/utils/utilsMeshes";
import { Howl } from "howler";
import {
  Triangle,
  StopCircle,
  Radiation,
  ArrowUpDown,
  Loader2,
  ArrowRight,
} from "lucide-vue-next";
import { meshes as specialMeshes } from "~/utils/specialMeshes";

//@ts-ignore

import Engine from "~/components/gameLogic/Engine";
// import Player from "~/components/gameLogic/Robot";
import Models from "~/components/gameLogic/Models";
import Sequences from "./gameLogic/sequences";
import { cn } from "@/lib/utils";

const canvas = ref();
const config = useRuntimeConfig();
const loading = useLoadingStore();
const gameStateStire = useGameStateStore();
const finaltaskStore = useFinalTaskStore();
const generalStore = useGeneralStore();

const consoleDiv = ref();
//const sharedData = useSharedData();

const music = new Howl({
  src: ["/sounds/music.mpeg"],
  volume: 0.3,
});

onMounted(async () => {
  const { default: Player_Robot } = await import(
    "~/components/gameLogic/Robot"
  );
  const { default: Player_Drone } = await import(
    "~/components/gameLogic/Drone"
  );

  // Load the 3D engine
  const game = new Engine(canvas.value);
  await game.initPhysics();
  game.initLighting();
  utilsMeshes.initGame(game);

  const sequences = new Sequences(game);
  // new BABYLON.HemisphericLight(
  //   "light1",
  //   new BABYLON.Vector3(0, 1, 0),
  //   game.scene
  // );

  const models = new Models(game);
  await models.LoadMap(true);

  game.models = models;

  const scene = game.scene;

  const camera = new BABYLON.FreeCamera(
    "camera1",
    new BABYLON.Vector3(0, 10, 0),
    scene
  ) as BABYLON.FreeCamera;

  //camera.attachControl(canvas.value, true);

  // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
  game.addCamera(camera);
  // Target the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  await gameState.devtools.init(camera, scene!);

  const robotMeshesResult = await BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "/models/",
    "robot.glb",
    scene
  );
  let robot = new Player_Robot(robotMeshesResult, game);
  let drone: typeof Player_Drone | null = null;

  eventBus.addEventListener("loadGLB", (event: CustomEventInit) => {
    const dataStream = event.detail.replace(
      "data:application/octet-stream;",
      "data:model/gltf-binary;"
    );
    //console.log(dataStream);
    loading.isLoading = true;

    setTimeout(() => {
      models.LoadMapFromBase64(dataStream);
      robot.mesh.position.y = 0.2;
      robot.mesh.position.x = 0;
      robot.mesh.position.z = 0;
      loading.isLoading = false;
    }, 100);
  });
  eventBus.addEventListener("runScene", (event: CustomEventInit) => {
    setTimeout(async () => {
      //@ts-ignore
      await sequences[event.detail]();
      console.log("sequence completed");
    }, 500);
  });
  eventBus.addEventListener("destroy_all_meshes", (event: CustomEventInit) => {
    models.ClearMap();
  });

  async function to_nasa() {
    // if (robot) robot.mesh.position = new BABYLON.Vector3(0, 0, 0);
    // //@ts-ignore
    // if (drone) drone.mesh.position = new BABYLON.Vector3(0, 0, 0);

    if (robot) robot.dispose();
    //@ts-ignore
    if (drone) drone.dispose();

    await models.LoadMap(true, "satellite_control.glb");
    loading.isLoading = false;
    gameStateStire.currentMap = "nasa";
  }

  eventBus.addEventListener("to_nasa", async (event: CustomEventInit) => {
    await to_nasa();
    event.detail();
  });

  eventBus.addEventListener("to_drone", async (event: CustomEventInit) => {
    //loading.isLoading = true
    const playerCoords = robot.mesh.position.clone();
    robot.dispose();
    const droneMeshesResult = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "drone.glb",
      scene
    );

    //@ts-ignore
    drone = new Player_Drone(droneMeshesResult, game, playerCoords);
  });

  eventBus.addEventListener(
    "load-satellite_control",
    async (event: CustomEventInit) => {
      await to_nasa();
      sequences.new_map_first();
    }
  );

  // Set camera angle
  camera.rotation.x = funcs.degToRad(140);

  if (generalStore.inDev) await funcs.delay(1500);

  loading.isLoading = false;

  // if (generalStore.inDev)
  //   setTimeout(() => {
  //     devtools.hide();
  //     sequences.final_task();
  //   }, 800);

  if (!generalStore.inDev) sequences.all();

  finaltaskStore.consoleElement = consoleDiv.value;

  onBeforeUnmount(() => {
    scene.dispose();
    game.engine.dispose();
  });
});

function runTest(type: "solarStorm" | "dataTransfer") {
  finaltaskStore.testing.testing = true;
  if (type === "solarStorm") finaltaskStore.testing.solarStorm = true;
  else finaltaskStore.testing.dataTransfer = true;

  eventBus.dispatchEvent(new CustomEvent("test_satellite", { detail: type }));
}
</script>

<template>
  <div
    class="size-full flex gap-3 overflow-hidden"
    :class="cn(gameStateStire.smallEngine && 'p-3')"
  >
    <div class="w-[50%]" v-if="gameStateStire.smallEngine">
      <SatelliteFix />
    </div>
    <div
      class="size-full flex flex-col gap-3"
      :class="cn(gameStateStire.smallEngine && 'w-[50%]')"
    >
      <div v-if="gameStateStire.smallEngine && false">
        <Button
          @click="finaltaskStore.running = !finaltaskStore.running"
          v-if="!finaltaskStore.running"
          >Avvia <Triangle class="rotate-90"
        /></Button>
        <Button @click="finaltaskStore.running = !finaltaskStore.running" v-else
          >Ferma <StopCircle
        /></Button>
      </div>
      <div
        v-if="gameStateStire.smallEngine && !finaltaskStore.inFinalTest"
        class="flex items-center gap-2"
      >
        <div class="w-full flex items-center gap-2">
          <Button
            @click="runTest('solarStorm')"
            :disabled="finaltaskStore.testing.testing"
            class="bg-orange-800 hover:bg-orange-950 text-white/80"
            >Tempesta solare
            <Radiation v-if="!finaltaskStore.testing.solarStorm" />
            <Loader2 v-else class="animate-spin" />
          </Button>
          <Button
            @click="runTest('dataTransfer')"
            :disabled="finaltaskStore.testing.testing"
            class="bg-green-800 hover:bg-green-950 text-white/80"
            >Trasferimento dati<ArrowUpDown
              v-if="!finaltaskStore.testing.dataTransfer" /><Loader2
              v-else
              class="animate-spin"
          /></Button>
        </div>
        <Button
          :disabled="
            finaltaskStore.testing.testing || !finaltaskStore.pointingEarth
          "
          @click="finaltaskStore.inFinalTest = true"
          >Test finale <ArrowRight
        /></Button>
      </div>
      <div :class="cn('size-full h-full')">
        <canvas
          ref="canvas"
          class="size-full"
          :class="cn(gameStateStire.smallEngine && 'rounded-lg')"
        ></canvas>
      </div>
      <div
        v-if="gameStateStire.smallEngine"
        class="w-full grid grid-cols-2 gap-2 h-full"
      >
        <div class="border-2 rounded-md">
          <div class="p-2 dark:bg-black bg-white rounded-sm">Console</div>
          <Separator class="my-2" />
          <div class="overflow-y-auto flex flex-col gap-2 p-2" ref="consoleDiv">
            <div
              class="p-2 rounded-md flex items-center gap-3"
              :class="
                cn(i.type == 'error' ? 'bg-red-900' : 'dark:bg-black bg-white')
              "
              v-for="i in finaltaskStore.console"
              :key="i.id"
            >
              {{ i.id }}<Separator orientation="vertical" class="bg-white/30" />
              {{ i.msg }}
            </div>
          </div>
        </div>
        <div class="size-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Condizione</TableHead>
                <TableHead>Stato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Puntando alla terra</TableCell>
                <TableCell>
                  <CompletionIndicator
                    :checked="finaltaskStore.pointingEarth"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Gestione trasferimento dati</TableCell>
                <TableCell>
                  <CompletionIndicator :checked="finaltaskStore.data_tansfer" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Gestione tempeste solari</TableCell>
                <TableCell>
                  <CompletionIndicator :checked="finaltaskStore.solar_storms" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  overflow: hidden;
}
</style>
