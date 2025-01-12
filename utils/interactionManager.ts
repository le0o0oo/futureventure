import * as BABYLON from "babylonjs";
import * as specialMeshesObj from "~/utils/specialMeshes";

const specialMeshes = ["traffic_light", "cables_fix", "drone_spawn"];

function isSpecialMesh(mesh_name: string) {
  return specialMeshes.includes(mesh_name);
}

function handleMesh(mesh: BABYLON.AbstractMesh) {
  if (
    mesh.name != "drone_spawn" &&
    (!isSpecialMesh(mesh.name) || mesh.id != specialMeshesObj.meshes.target?.id)
  )
    return;

  const taskStore = useTasksStore();

  if (mesh.name == "traffic_light") taskStore.type = "traffic_light";
  else if (mesh.name == "cables_fix") taskStore.type = "cables_fix";
  else if (mesh.name == "drone_spawn") taskStore.type = "drone_spawn";

  if (!taskStore.doingTask) taskStore.showMessage = true;
}

export default { isSpecialMesh, handleMesh, specialMeshes };
