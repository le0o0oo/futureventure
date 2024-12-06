import { defineStore } from "pinia";
import { Engine, Scene, FreeCamera, FlyCamera, HavokPlugin } from "babylonjs";
import HavokPhysics from "@babylonjs/havok";
import { type HavokPhysicsWithBindings } from "@babylonjs/havok";

export const useEngineStore = defineStore({
  id: "engineStore",
  state: () => ({
    engine: {} as Engine,
    scene: {} as Scene,
    cameras: [] as FreeCamera[] | FlyCamera[],
    havokInstance: {} as HavokPhysicsWithBindings,
  }),
  actions: {
    async init(container: HTMLCanvasElement) {
      const currentEngine = new Engine(container, true);
      const currentScene = new Scene(currentEngine);

      this.scene = currentScene;
      this.engine = currentEngine;
      //this.havokInstance = await HavokPhysics();
      this.scene.enablePhysics(
        null,
        new HavokPlugin(true, await HavokPhysics())
      );
      //const havokPlugin = new BABYLON.HavokPlugin(true, this.havokInstance);

      currentEngine.runRenderLoop(function () {
        currentScene.render();
      });
      window.addEventListener("resize", function () {
        currentEngine.resize();
      });

      // Creates and positions a free camera
      this.cameras.push(
        //@ts-ignore
        new BABYLON.FreeCamera(
          "camera1",
          new BABYLON.Vector3(0, 5, -10),
          //@ts-ignore
          currentScene
        )
      );

      if (import.meta.dev) {
        const { Inspector } = await import("@babylonjs/inspector");
        //@ts-ignore
        Inspector.Show(currentScene, {
          gizmoCamera: this.cameras[0],
        });
      }
    },
  },
});
