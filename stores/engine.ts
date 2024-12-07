import * as BABYLON from "babylonjs";
import HavokPhysics from "@babylonjs/havok";
import { type HavokPhysicsWithBindings } from "@babylonjs/havok";

const engineState = {
  engine: {} as BABYLON.Engine,
  scenes: [] as BABYLON.Scene[],
  cameras: [] as BABYLON.Camera[] | BABYLON.FreeCamera[],
};

async function init(container: HTMLCanvasElement) {
  const currentEngine = new BABYLON.Engine(container, true, {
    preserveDrawingBuffer: true,
    stencil: true,
  });
  const currentScene = new BABYLON.Scene(currentEngine);

  engineState.engine = currentEngine;
  engineState.scenes.push(currentScene);

  currentScene.enablePhysics(
    null,
    new BABYLON.HavokPlugin(true, await HavokPhysics())
  );

  currentEngine.runRenderLoop(function () {
    currentScene.render();
  });
  window.addEventListener("resize", function () {
    currentEngine.resize();
  });
  currentScene.registerBeforeRender(() => {
    container.onblur = () => {
      console.log("Focus is lost");
      container.focus();
    };
  });
}

const devtools = {
  cScene: {} as BABYLON.Scene,
  cCamera: {} as BABYLON.Camera,
  init: async (
    camera: BABYLON.Camera | BABYLON.FreeCamera,
    scene: BABYLON.Scene
  ) => {
    if (import.meta.dev) {
      const { Inspector } = await import("@babylonjs/inspector");
      //@ts-ignore
      Inspector.Show(scene, {
        gizmoCamera: camera,
      });
      devtools.cScene = scene;
      devtools.cCamera = camera;
    }
  },
  hide: async () => {
    if (import.meta.dev) {
      const { Inspector } = await import("@babylonjs/inspector");
      Inspector.Hide();
    }
  },
  toggle: async () => {
    if (import.meta.dev) {
      const { Inspector } = await import("@babylonjs/inspector");
      Inspector.IsVisible
        ? Inspector.Hide()
        : //@ts-ignore
          Inspector.Show(devtools.cScene, {
            gizmoCamera: devtools.cCamera,
          });
    }
  },
};

export { engineState, init, devtools };
