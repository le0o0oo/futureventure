<script lang="ts" setup>
import * as BABYLON from "babylonjs";
import * as gameState from "~/stores/engine";
import funcs from "~/utils/generalFuncs";
import "babylonjs-loaders";
import { eventBus } from "~/event-bus";

import Engine from "~/components/gameLogic/Engine";
import Player from "~/components/gameLogic/Robot";
import Models from "~/components/gameLogic/Models";
import Sequences from "./gameLogic/sequences";

const canvas = ref();
const config = useRuntimeConfig();
const loading = useLoadingStore();
//const sharedData = useSharedData();

onMounted(async () => {
  // Load the 3D engine
  const game = new Engine(canvas.value);
  await game.initPhysics();
  game.initLighting();

  const sequences = new Sequences(game);
  // new BABYLON.HemisphericLight(
  //   "light1",
  //   new BABYLON.Vector3(0, 1, 0),
  //   game.scene
  // );

  const models = new Models(game);
  await models.LoadMap(true);

  const scene = game.scene;

  const camera = new BABYLON.FreeCamera(
    "camera1",
    new BABYLON.Vector3(0, 10, 0),
    scene
  ) as BABYLON.FreeCamera;

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
  let robot = new Player(robotMeshesResult, game);

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
  // Set camera angle
  camera.rotation.x = funcs.degToRad(140);

  loading.isLoading = false;
});
</script>

<template>
  <div class="size-full">
    <canvas ref="canvas" class="size-full"></canvas>
  </div>
</template>

<style></style>
