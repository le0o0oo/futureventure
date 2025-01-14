import * as BABYLON from "babylonjs";
import { Inspector } from "babylonjs-inspector";

const config = useRuntimeConfig();

const devtools = {
  cScene: {} as BABYLON.Scene,
  cCamera: {} as BABYLON.Camera,
  init: async (
    camera: BABYLON.Camera | BABYLON.FreeCamera,
    scene: BABYLON.Scene
  ) => {
    const generalStore = useGeneralStore();
    if (generalStore.inDev) {
      //@ts-ignore
      Inspector.Show(scene, {
        gizmoCamera: camera,
      });
      devtools.cScene = scene;
      devtools.cCamera = camera;
    }
  },
  hide: async () => {
    const generalStore = useGeneralStore();
    if (generalStore.inDev) {
      Inspector.Hide();
    }
  },
  toggle: async () => {
    const generalStore = useGeneralStore();
    if (generalStore.inDev) {
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
