<script lang="ts" setup>
import * as BABYLON from "babylonjs";
import * as gameState from "~/stores/engine";
import funcs from "~/utils/generalFuncs";
import "babylonjs-loaders";

import Engine from "~/components/gameLogic/Engine";

definePageMeta({
  layout: "game",
});

const canvas = ref();
const config = useRuntimeConfig();

const keyStatus = {
  up: false,
  down: false,
  left: false,
  right: false,
};

onMounted(async () => {
  // Load the 3D engine
  const game = new Engine(canvas.value);
  await game.initPhysics();

  const scene = game.scene;
  scene.actionManager = new BABYLON.ActionManager(scene);
  scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnKeyDownTrigger,
      (ev) => {
        const key = ev.sourceEvent.key;

        if (config.public.keybinds.down.includes(key)) keyStatus.down = true;
        if (config.public.keybinds.up.includes(key)) keyStatus.up = true;
        if (config.public.keybinds.left.includes(key)) keyStatus.left = true;
        if (config.public.keybinds.right.includes(key)) keyStatus.right = true;
      }
    )
  );
  scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnKeyUpTrigger,
      (ev) => {
        const key = ev.sourceEvent.key;

        if (config.public.keybinds.down.includes(key)) keyStatus.down = false;
        if (config.public.keybinds.up.includes(key)) keyStatus.up = false;
        if (config.public.keybinds.left.includes(key)) keyStatus.left = false;
        if (config.public.keybinds.right.includes(key)) keyStatus.right = false;
      }
    )
  );

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

  var ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 30, height: 30 },
    scene
  );

  //sphere.position.y = 5;
  //
  // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable

  //BABYLON.SceneLoader.RegisterPlugin(new OBJFileLoader());
  const result = await BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "/models/",
    "robot.glb",
    scene
  );
  const playerMesh = result.meshes[0];
  playerMesh!.rotate(BABYLON.Axis.Y, funcs.degToRad(-90), BABYLON.Space.WORLD);
  playerMesh?.translate(BABYLON.Axis.Y, 2, BABYLON.Space.WORLD);
  playerMesh?.scaling.setAll(0.8);

  var sphereAggregate = new BABYLON.PhysicsAggregate(
    playerMesh!,
    BABYLON.PhysicsShapeType.SPHERE,
    { mass: 1, restitution: 0.75, friction: 5 },
    scene
  );
  sphereAggregate.body.disablePreStep = false;

  // Create a static box shape.
  var groundAggregate = new BABYLON.PhysicsAggregate(
    ground,
    BABYLON.PhysicsShapeType.BOX,
    { mass: 0 },
    scene
  );

  // Set camera angle
  camera.rotation.x = funcs.degToRad(140);

  // playerMesh!.rotation = new BABYLON.Vector3(0, funcs.degToRad(90), 0);

  game.scene.onBeforeRenderObservable.add(() => {
    camera.position.x = playerMesh!.position.x;
    camera.position.y = playerMesh!.position.y + 20;
    camera.position.z = playerMesh!.position.z - 20;

    const rightVverticalSideSpeedAdd = 0.01;
    const leftVerticalSideSpeedAdd = 0.022;

    if (keyStatus.up) {
      playerMesh!.rotation = new BABYLON.Vector3(0, funcs.degToRad(-90), 0);
      playerMesh?.moveWithCollisions(
        playerMesh.right.scaleInPlace(config.public.speed)
      );
    }
    if (keyStatus.down) {
      playerMesh!.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
      playerMesh?.moveWithCollisions(
        playerMesh.right.scaleInPlace(config.public.speed)
      );
    }
    if (keyStatus.left) {
      playerMesh!.rotation = new BABYLON.Vector3(0, funcs.degToRad(90 + 40), 0);
      playerMesh?.movePOV(
        config.public.speed * -1,
        0,
        config.public.speed + leftVerticalSideSpeedAdd
      );
    }
    if (keyStatus.right) {
      playerMesh!.rotation = new BABYLON.Vector3(0, funcs.degToRad(40), 0);
      playerMesh?.movePOV(
        config.public.speed * -1 - rightVverticalSideSpeedAdd,
        0,
        config.public.speed * -1 + rightVverticalSideSpeedAdd
      );
    }
  });
});
</script>

<template>
  <div class="size-full">
    <canvas ref="canvas" class="size-full"></canvas>
  </div>
</template>

<style></style>
