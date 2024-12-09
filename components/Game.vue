<script lang="ts" setup>
import * as BABYLON from "babylonjs";
import * as gameState from "~/stores/engine";
import funcs from "~/utils/generalFuncs";
import "babylonjs-loaders";

import Engine from "~/components/gameLogic/Engine";
import Player from "~/components/gameLogic/Player";
import Models from "~/components/gameLogic/Models";

const canvas = ref();
const config = useRuntimeConfig();

onMounted(async () => {
  // Load the 3D engine
  const game = new Engine(canvas.value);
  await game.initPhysics();

  const models = new Models(game);
  await models.LoadMap(false);

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

  var light = new BABYLON.HemisphericLight(
    "light1",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // var ground = BABYLON.MeshBuilder.CreateGround(
  //   "ground",
  //   { width: 30, height: 30 },
  //   scene
  // );
  // Create a static box shape.
  // var groundAggregate = new BABYLON.PhysicsAggregate(
  //   ground,
  //   BABYLON.PhysicsShapeType.BOX,
  //   { mass: 0 },
  //   scene
  // );

  const robotMeshesResult = await BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "/models/",
    "robot.glb",
    scene
  );

  const robot = new Player(robotMeshesResult, game);

  // Set camera angle
  camera.rotation.x = funcs.degToRad(140);
});
</script>

<template>
  <div class="size-full">
    <canvas ref="canvas" class="size-full"></canvas>
  </div>
</template>

<style></style>
