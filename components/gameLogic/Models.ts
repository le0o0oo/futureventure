import * as BABYLON from "babylonjs";
import type Engine from "./Engine";

class Models {
  constructor(private game: Engine) {
    this.game = game;
  }

  CreateGround(
    props = { size: { width: 100, height: 100 }, usePhysics: true }
  ) {
    const ground = BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: props.size.width, height: props.size.height },
      this.game.scene
    );
    const groundMaterial = new BABYLON.StandardMaterial(
      "ground",
      this.game.scene
    );
    groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    groundMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    ground.material = groundMaterial;

    var groundAggregate: BABYLON.PhysicsAggregate | undefined;
    if (props.usePhysics)
      groundAggregate = new BABYLON.PhysicsAggregate(
        ground,
        BABYLON.PhysicsShapeType.BOX,
        { mass: 0 },
        this.game.scene
      );

    return [ground, groundAggregate];
  }

  async LoadMap() {
    const models = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "map.glb"
    );

    models.meshes.forEach((mesh) => {
      mesh.checkCollisions = true;
    });
  }
}

export default Models;
