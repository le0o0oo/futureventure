import * as BABYLON from "babylonjs";
import * as specialMeshesObj from "~/utils/specialMeshes";

const specialMeshes = ["traffic_light"];

function isSpecialMesh(mesh_name: string) {
  return specialMeshes.includes(mesh_name);
}

function handleMesh(mesh: BABYLON.AbstractMesh) {
  if (
    !isSpecialMesh(mesh.name) ||
    mesh.id != specialMeshesObj.meshes.target?.id
  )
    return;

  const taskStore = useTasksStore();
  if (mesh.name == "traffic_light") taskStore.type = "traffic_light";
  if (!taskStore.doingTask) taskStore.showMessage = true;
}

export default { isSpecialMesh, handleMesh, specialMeshes };
