import * as BABYLON from "babylonjs";

const specialMeshes = ["traffic_light"];

function isSpecialMesh(mesh_name: string) {
  return specialMeshes.includes(mesh_name);
}

function handleMesh(mesh: BABYLON.AbstractMesh) {
  if (!isSpecialMesh(mesh.name)) return;

  const taskStore = useTasksStore();
  if (mesh.name == "traffic_light") taskStore.type = "traffic_light";
  taskStore.showMessage = true;
  console.log("handling special mesh");
}

export default { isSpecialMesh, handleMesh };
