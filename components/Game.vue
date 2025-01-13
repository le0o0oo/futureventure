<script lang="ts" setup>
import * as BABYLON from "babylonjs";
import * as gameState from "~/stores/engine";
import funcs from "~/utils/generalFuncs";
import "babylonjs-loaders";
import { eventBus } from "~/event-bus";
import utilsMeshes from "~/utils/utilsMeshes";
import { Howl } from "howler";
import { meshes as specialMeshes } from "~/utils/specialMeshes";

import Engine from "~/components/gameLogic/Engine";
// import Player from "~/components/gameLogic/Robot";
import Models from "~/components/gameLogic/Models";
import Sequences from "./gameLogic/sequences";

const canvas = ref();
const config = useRuntimeConfig();
const loading = useLoadingStore();
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

  camera.attachControl(canvas.value, true);

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
      if (robot) robot.mesh.position = new BABYLON.Vector3(0, 0, 0);
      //@ts-ignore
      if (drone) drone.mesh.position = new BABYLON.Vector3(0, 0, 0);

      await models.LoadMap(true, "satellite_control.glb");
      loading.isLoading = false;
    }
  );

  // Set camera angle
  camera.rotation.x = funcs.degToRad(140);

  loading.isLoading = false;
  //music.play();
});
</script>

<template>
  <div class="size-full">
    <canvas ref="canvas" class="size-full"></canvas>
  </div>
</template>

<style></style>
