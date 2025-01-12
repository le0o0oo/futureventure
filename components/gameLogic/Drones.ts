import * as BABYLON from "babylonjs";
import type Engine from "./Engine";
import { consola } from "consola";
import * as specialMeshes from "~/utils/specialMeshes";
import utilsMeshes from "~/utils/utilsMeshes";

const config = useRuntimeConfig();

class Models {
  private game: Engine;
  private drones: BABYLON.AbstractMesh[] = [];

  constructor(private gameInstance: Engine) {
    this.game = gameInstance;
  }
}

export default Models;
