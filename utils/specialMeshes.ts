import { type AbstractMesh } from "babylonjs";

const meshes = {
  target: null as AbstractMesh | null,

  traffic_light: [] as AbstractMesh[],
};

function addSpecialMesh(name: string, mesh: AbstractMesh) {
  if (name == "traffic_light") {
    meshes.traffic_light.push(mesh);
  }
}

function reset() {
  for (const key in meshes) {
    //@ts-ignore
    meshes[key] = [];
  }
}

export { meshes, addSpecialMesh, reset };
