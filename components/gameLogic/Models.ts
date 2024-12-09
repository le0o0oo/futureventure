import * as BABYLON from "babylonjs";
import type Engine from "./Engine";
import { consola } from "consola";

class Models {
  constructor(private game: Engine) {
    this.game = game;
  }

  CreateGround(props = { size: { width: 100, height: 100 } }) {
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

    if (this.game.usingPhysics)
      groundAggregate = new BABYLON.PhysicsAggregate(
        ground,
        BABYLON.PhysicsShapeType.BOX,
        { mass: 0 },
        this.game.scene
      );

    return [ground, groundAggregate];
  }

  async LoadMap(accurate = false) {
    const models = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "map1.glb"
    );

    if (import.meta.dev) {
      consola.info(
        "MESH LOADER |",
        accurate ? "Using accurate mode" : "Using inaccurate mode"
      );
      consola.info("MESH LOADER |", models.meshes.length + " meshes");
    }

    models.meshes.forEach((mesh, index) => {
      mesh.checkCollisions = true;
      const doCheck: boolean = index != 0;

      if (this.game.usingPhysics && doCheck) {
        if (!accurate) {
          // Create a PhysicsAggregate for each mesh
          new BABYLON.PhysicsAggregate(
            mesh, // The mesh to apply the physics to
            BABYLON.PhysicsShapeType.BOX, // Use a BOX shape (you can adjust this based on your needs)
            { mass: 0 }, // No mass for static objects, adjust as needed
            this.game.scene // Pass the scene object
          );
        } else {
          try {
            // Create a PhysicsAggregate for each mesh with a more accurate hitbox (MESH shape type)
            new BABYLON.PhysicsAggregate(
              mesh, // The mesh to apply the physics to
              BABYLON.PhysicsShapeType.MESH, // Use the MESH shape to match the mesh geometry exactly
              { mass: 0 }, // No mass for static objects, adjust as needed
              this.game.scene // Pass the scene object
            );
          } catch (err) {
            consola.error("Error loading mesh at index " + index, err);
            //console.error("Error loading mesh at index " + index, err);
          }
        }
      }
    });
  }
}

export default Models;
