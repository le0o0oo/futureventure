import * as BABYLON from "babylonjs";

const devtools = {
  cScene: {} as BABYLON.Scene,
  cCamera: {} as BABYLON.Camera,
  init: async (
    camera: BABYLON.Camera | BABYLON.FreeCamera,
    scene: BABYLON.Scene
  ) => {
    if (import.meta.dev) {
      const { Inspector } = await import("babylonjs-inspector");
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
      const { Inspector } = await import("babylonjs-inspector");
      Inspector.Hide();
    }
  },
  toggle: async () => {
    if (import.meta.dev) {
      const { Inspector } = await import("babylonjs-inspector");
      Inspector.IsVisible
        ? Inspector.Hide()
        : //@ts-ignore
          Inspector.Show(devtools.cScene, {
            gizmoCamera: devtools.cCamera,
          });
    }
  },
};

export { devtools };
