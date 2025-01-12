import * as BABYLON from "babylonjs";
import type Engine from "~/components/gameLogic/Engine";
import * as specialMeshes from "./specialMeshes";
import generalFuncs from "./generalFuncs";

let game = null as Engine | null;

const meshes = {
  initGame: (iGame: Engine) => {
    game = iGame;
    meshes.game = iGame;
  },
  game: game,

  arrow: {
    spawn: async (inverted?: boolean) => {
      if (meshes.arrow.model) return;

      const sharedData = useSharedData();
      const arrowMeshResult = (
        await BABYLON.SceneLoader.ImportMeshAsync(
          "",
          "/models/",
          "arrow.glb",
          game!.scene
        )
      ).meshes[0];

      arrowMeshResult!.isPickable = false;
      arrowMeshResult!.receiveShadows = false;

      meshes.arrow.model = arrowMeshResult!;

      meshes.arrow.observer = meshes.game!.scene.onBeforeRenderObservable.add(
        () => {
          arrowMeshResult!.position = meshes.currentPlayer!.position.clone();
          if (sharedData.cameraInSight) arrowMeshResult!.position.y += 2;
          else arrowMeshResult!.position.y += 0.8;

          const targetPosition = new BABYLON.Vector3(
            specialMeshes.meshes.target!.position.x * (inverted ? 1 : -1),
            arrowMeshResult!.position.y,
            specialMeshes.meshes.target!.position.z
          );

          arrowMeshResult?.lookAt(targetPosition);
        }
      );
    },

    despawn() {
      meshes.game!.scene.onBeforeRenderObservable.remove(meshes.arrow.observer);
      if (meshes.arrow.model) {
        meshes.arrow.model.dispose();
        meshes.arrow.model = null;
      }
    },

    observer: null as BABYLON.Observer<BABYLON.Scene> | null,
    model: null as BABYLON.AbstractMesh | null,
  },

  drone: {
    spawn: async (): Promise<BABYLON.AbstractMesh> => {
      const sharedData = useSharedData();
      const meshResult = (
        await BABYLON.SceneLoader.ImportMeshAsync(
          "",
          "/models/",
          "drone.glb",
          game!.scene
        )
      ).meshes[0];

      meshResult!.isPickable = true;
      meshResult!.receiveShadows = true;

      if (game!.shadowGenerator)
        game!.shadowGenerator!.getShadowMap()!.renderList!.push(meshResult!);

      return meshResult!;
    },
    despawn: () => {},

    model: null as BABYLON.AbstractMesh | null,
  },

  currentPlayer: null as BABYLON.AbstractMesh | null,
};

export default meshes;
