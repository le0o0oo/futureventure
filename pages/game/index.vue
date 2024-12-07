<script lang="ts" setup>
import * as BABYLON from "babylonjs";
import * as gameState from "~/stores/engine";
import funcs from "~/utils/generalFuncs";
import "babylonjs-loaders";

definePageMeta({
  layout: "game",
});

const canvas = ref();
const config = useRuntimeConfig();

onMounted(async () => {
  // Load the 3D engine
  await gameState.init(canvas.value);
  const scene = gameState.engineState.scenes[0];
  canvas.value.focus();

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
  // var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {
  //   diameter: 2,
  //   segments: 32,
  //   updatable: true,
  // });
  var ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 10, height: 10 },
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
  const importedMesh = result.meshes[0];
  importedMesh!.rotate(
    BABYLON.Axis.Y,
    funcs.degToRad(-90),
    BABYLON.Space.WORLD
  );
  importedMesh?.translate(BABYLON.Axis.Y, 2, BABYLON.Space.WORLD);

  var sphereAggregate = new BABYLON.PhysicsAggregate(
    importedMesh!,
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
  camera.rotation.x = funcs.degToRad(120);

  engineState.engine.runRenderLoop(function () {
    camera.position.x = importedMesh!.position.x;
    camera.position.y = importedMesh!.position.y + 15;
    camera.position.z = importedMesh!.position.z - 10;
  });

  scene!.onKeyboardObservable.add((kbInfo) => {
    switch (kbInfo.type) {
      case BABYLON.KeyboardEventTypes.KEYDOWN:
        if (config.public.keybinds.forward.includes(kbInfo.event.key)) {
          console.log("Moving forward");
          // console.log(sphere.position.z);
          // // sphere.position.z -= 0.1;
          // sphere.moveWithCollisions(
          //   sphere.forward.scaleInPlace(config.public.speed)
          // );
          // console.log(sphere.position.z);
          importedMesh?.translate(BABYLON.Axis.Z, -10, BABYLON.Space.WORLD);

          //sphereAggregate.body?.
          //sphere.position.z = 777777;
          //sphere.translate(BABYLON.Axis.Z, -40, BABYLON.Space.WORLD);
          // sphereAggregate.body.applyForce(
          //   new BABYLON.Vector3(0, 0, -10),
          //   sphere.absolutePosition
          // );
          //console.log("applicata forza");
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
