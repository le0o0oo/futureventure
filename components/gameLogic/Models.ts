import * as BABYLON from "babylonjs";
import type Engine from "./Engine";
import { consola } from "consola";

class Models {
  private mapModels?: BABYLON.ISceneLoaderAsyncResult;
  private accurate: boolean = false;
  private physicsAggregates: BABYLON.PhysicsAggregate[] = []; // Store references to physics aggregates

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
      "map.glb"
    );
    this.mapModels = models;
    this.accurate = accurate;

    if (import.meta.dev) {
      consola.info(
        "MESH LOADER |",
        accurate ? "Using accurate mode" : "Using inaccurate mode"
      );
      consola.info("MESH LOADER |", models.meshes.length + " meshes");
    }

    this.applyPhysicsAggregates(accurate);
  }

  async LoadMapFromBase64(base64: string) {
    // Dispose previous meshes and physics aggregates if they exist
    if (this.mapModels) {
      this.mapModels.meshes.forEach((mesh) => {
        mesh.dispose();
      });

      // Dispose all physics aggregates
      this.physicsAggregates.forEach((aggregate) => aggregate.dispose());
      this.physicsAggregates = []; // Clear the array after disposing
    }

    const models = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "",
      base64,
      this.game.scene
    );
    this.mapModels = models;

    this.applyPhysicsAggregates(this.accurate);
  }

  ProjectRaycast(
    options = {
      start: new BABYLON.Vector3(1, 20, 2),
      end: new BABYLON.Vector3(1, -20, 2),
      debugDraw: false,
      debugTimeout: 1000,
    }
  ) {
    const raycastRes = new BABYLON.PhysicsRaycastResult();
    var start = options.start;
    var end = options.end;
    this.game.scene
      .getPhysicsEngine()!
      //@ts-ignore
      .raycastToRef(start, end, raycastRes);

    if (options.debugDraw) {
      const points = [start, end];
      const rayLine = BABYLON.MeshBuilder.CreateLines(
        "ray",
        { points: points },
        this.game.scene
      );
      rayLine.color = BABYLON.Color3.Red(); // Set the line color to red
      setTimeout(() => {
        rayLine.dispose();
      }, options.debugTimeout); // Dispose after 1 second (you can adjust as needed)
    }

    return raycastRes.hasHit;
  }

  private applyPhysicsAggregates(accurate = false) {
    if (!this.mapModels) return;

    this.mapModels.meshes.forEach((mesh, index) => {
      mesh.checkCollisions = true;
      const doCheck: boolean = index != 0;

      if (this.game.usingPhysics && doCheck) {
        if (!accurate) {
          // Create a PhysicsAggregate for each mesh
          const aggregate = new BABYLON.PhysicsAggregate(
            mesh, // The mesh to apply the physics to
            BABYLON.PhysicsShapeType.BOX, // Use a BOX shape (you can adjust this based on your needs)
            { mass: 0 }, // No mass for static objects, adjust as needed
            this.game.scene // Pass the scene object
          );
          this.physicsAggregates.push(aggregate); // Store the reference to the aggregate
        } else {
          try {
            // Create a PhysicsAggregate for each mesh with a more accurate hitbox (MESH shape type)
            const aggregate = new BABYLON.PhysicsAggregate(
              mesh, // The mesh to apply the physics to
              BABYLON.PhysicsShapeType.MESH, // Use the MESH shape to match the mesh geometry exactly
              { mass: 0 }, // No mass for static objects, adjust as needed
              this.game.scene // Pass the scene object
            );
            this.physicsAggregates.push(aggregate); // Store the reference to the aggregate
          } catch (err) {
            consola.error("Error loading mesh at index " + index, err);
          }
        }
      }
    });
  }
}

export default Models;
