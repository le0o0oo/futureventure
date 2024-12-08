import * as BABYLON from "babylonjs";

function addHemisphericLight(scene: BABYLON.Scene): BABYLON.HemisphericLight {
  const light = new BABYLON.HemisphericLight(
    "light1",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  return light;
}

export default { addHemisphericLight };
