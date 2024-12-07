<script lang="ts" setup>
import * as BABYLON from "babylonjs";
import * as gameState from "~/stores/engine";

definePageMeta({
  layout: "game",
});

const canvas = ref();
const config = useRuntimeConfig();

onMounted(async () => {
  // Load the 3D engine
  await gameState.init(canvas.value);
  const scene = gameState.engineState.scenes[0];

  // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
  gameState.engineState.cameras.push(
    new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 10, 0), scene)
  );

  const camera = gameState.engineState.cameras[0] as BABYLON.FreeCamera;

  // Target the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  await gameState.devtools.init(camera, scene!);

  var light = new BABYLON.HemisphericLight(
    "light1",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
  var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {
    diameter: 2,
    segments: 32,
    updatable: true,
  });
  var ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 10, height: 10 },
    scene
  );

  // Move the sphere upward 1/2 of its height
  sphere.position.y = 5;
  // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable

  var sphereAggregate = new BABYLON.PhysicsAggregate(
    sphere,
    BABYLON.PhysicsShapeType.SPHERE,
    { mass: 1, restitution: 0.75, friction: 5 },
    scene
  );

  // Create a static box shape.
  var groundAggregate = new BABYLON.PhysicsAggregate(
    ground,
    BABYLON.PhysicsShapeType.BOX,
    { mass: 0 },
    scene
  );

  engineState.engine.runRenderLoop(function () {
    camera.position.x = sphere.position.x;
    camera.position.y = sphere.position.y + 20;
    camera.position.z = sphere.position.z + 3;
  });

  scene!.onKeyboardObservable.add((kbInfo) => {
    switch (kbInfo.type) {
      case BABYLON.KeyboardEventTypes.KEYDOWN:
        if (config.public.keybinds.forward.includes(kbInfo.event.key)) {
          console.log("Moving forward");
          console.log(sphere.position.z);
          //sphere.position.z -= 0.1;
          console.log(sphere.position.z);

          //sphereAggregate.body?.
          //sphere.position.z = 777777;
          //sphere.translate(BABYLON.Axis.Z, -40, BABYLON.Space.WORLD);
          sphereAggregate.body.applyForce(
            new BABYLON.Vector3(0, 0, -10),
            sphere.absolutePosition
          );
          console.log("applicata forza");
        }
        if (config.public.keybinds.backward.includes(kbInfo.event.key)) {
          console.log("Moving backwards");
        }
        if (config.public.keybinds.left.includes(kbInfo.event.key)) {
          console.log("Moving left");
        }
        if (config.public.keybinds.right.includes(kbInfo.event.key)) {
          console.log("Moving right");
        }
        break;
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
