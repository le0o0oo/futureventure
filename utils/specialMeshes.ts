import {
  type AbstractMesh,
  type StandardMaterial,
  type Material,
} from "babylonjs";
import utilsMeshes from "./utilsMeshes";

const meshes = {
  target: null as AbstractMesh | null,

  traffic_light: [] as AbstractMesh[],
  cables_fix: [] as AbstractMesh[],
};

let invis_material_cache = null as StandardMaterial | null;

function getInvisibleMaterial(): StandardMaterial {
  if (invis_material_cache) {
    return invis_material_cache;
  } else {
    //@ts-ignore
    invis_material_cache =
      utilsMeshes.game!.scene.getMaterialByName("invisible_material")!;

    return invis_material_cache!;
  }
}

function addSpecialMesh(name: string, mesh: AbstractMesh) {
  if (name == "traffic_light") {
    meshes[name].push(mesh);
    mesh.material = getInvisibleMaterial();
  } else if (name == "cables_fix") {
    meshes[name].push(mesh);
  }
}

function reset() {
  for (const key in meshes) {
    //@ts-ignore
    meshes[key] = [];
  }
}

export { meshes, addSpecialMesh, reset };
