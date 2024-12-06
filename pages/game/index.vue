<script lang="ts" setup>
import * as BABYLON from "babylonjs";
import { onKeyStroke } from "@vueuse/core";

const { init: initEngine, initDevTools } = useEngineStore();

const canvas = ref();
const config = useRuntimeConfig();

onMounted(async () => {
  await initEngine(canvas.value);
  // initialize plugin
  // var hk = new BABYLON.HavokPlugin(true, havokInstance);
  // scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), hk);

  const { engine, scene: sceneBR, cameras, havokInstance } = useEngineStore();

  const scene = sceneBR as BABYLON.Scene;

  //@ts-ignore
  cameras.push(
    //@ts-ignore
    new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 10, 0), sceneBR)
  );
  await initDevTools(cameras[0]! as BABYLON.Camera);
  const camera = cameras[0] as BABYLON.Camera;
  // Targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());
  // Attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'sphere' shape.
  var sphere = BABYLON.MeshBuilder.CreateSphere(
    "sphere",
    { diameter: 2, segments: 32 },
    scene
  );

  // Move the sphere upward at 4 units
  sphere.position.y = 4;

  // Our built-in 'ground' shape.
  var ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 10, height: 10 },
    scene
  );

  // Create a sphere shape and the associated body. Size will be determined automatically.
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

  engine.runRenderLoop(() => {
    camera.position.x = sphere.position.x;
    camera.position.y = sphere.position.y + 20;
    camera.position.z = sphere.position.z;
  });

  scene.onKeyboardObservable.add((kbInfo) => {
    switch (kbInfo.type) {
      case BABYLON.KeyboardEventTypes.KEYDOWN:
        console.log("KEY DOWN: ", kbInfo.event.key);
        break;
      case BABYLON.KeyboardEventTypes.KEYUP:
        console.log("KEY UP: ", kbInfo.event.code);
        break;
    }
  });

  onKeyStroke(config.public.keybinds.forward, (e: Event) => {
    e.preventDefault();

    sphereAggregate.body.applyForce(
      new BABYLON.Vector3(0, 0, config.public.speed),
      sphere.absolutePosition
    );
  });
  onKeyStroke(config.public.keybinds.backward, (e: Event) => {
    e.preventDefault();

    sphereAggregate.body.applyForce(
      new BABYLON.Vector3(0, 0, config.public.speed * -1),
      sphere.absolutePosition
    );
  });
  onKeyStroke(config.public.keybinds.right, (e: Event) => {
    e.preventDefault();

    sphereAggregate.body.applyForce(
      new BABYLON.Vector3(config.public.speed, 0, 0),
      sphere.absolutePosition
    );
  });
  onKeyStroke(config.public.keybinds.left, (e: Event) => {
    e.preventDefault();

    sphereAggregate.body.applyForce(
      new BABYLON.Vector3(config.public.speed * -1, 0, 0),
      sphere.absolutePosition
    );
  });
});
</script>

<template>
  <div class="w-screen h-screen">
    <canvas class="size-full" ref="canvas"></canvas>
  </div>
</template>

<style></style>
