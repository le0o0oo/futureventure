import * as BABYLON from "babylonjs";
import type Engine from "./Engine";
import { consola } from "consola";
import * as specialMeshes from "~/utils/specialMeshes";

const config = useRuntimeConfig();

class Models {
  private mapModels?: BABYLON.ISceneLoaderAsyncResult;
  private accurate: boolean = false;
  private physicsAggregates: BABYLON.PhysicsAggregate[] = []; // Store references to physics aggregates

  private invisibleBaterial: BABYLON.StandardMaterial;

  constructor(private game: Engine) {
    this.game = game;

    this.invisibleBaterial = new BABYLON.StandardMaterial(
      "invisible_material",
      game.scene
    );
    this.invisibleBaterial.diffuseColor.set(0, 0, 0); // Black color
    this.invisibleBaterial.specularColor.set(0, 0, 0); // No specular highlight
    this.invisibleBaterial.alpha = 0; // Fully transparent
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

    if (config.public.inDev) {
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
      }, options.debugTimeout);
    }

    return raycastRes;
  }

  private applyPhysicsAggregates(accurate = false) {
    if (!this.mapModels) return;
    if (this.game.shadowGenerator)
      this.game.shadowGenerator!.getShadowMap()!.renderList = [];

    specialMeshes.reset();

    this.mapModels.meshes.forEach((mesh, index) => {
      //console.log(mesh.name, mesh.id);
      //if (mesh.name == "traffic_light") consola.info("trovato semaforfo");
      mesh.isPickable = true;
      mesh.checkCollisions = true;
      mesh.receiveShadows = true;
      const doCheck: boolean = index != 0;

      mesh.id += "_" + index;

      if (this.game.shadowGenerator)
        this.game.shadowGenerator!.getShadowMap()!.renderList!.push(mesh);

      specialMeshes.addSpecialMesh(mesh.name, mesh);

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
            //console.log(mesh);
          } catch (err) {
            consola.error(
              "MESH LOADER | Error loading mesh at index " + index,
              err
            );
          }
        }
      }

      if (mesh.material) {
        if (
          mesh.material instanceof BABYLON.PBRMaterial ||
          mesh.material instanceof BABYLON.StandardMaterial
        ) {
          mesh.material.ambientColor = new BABYLON.Color3(1, 1, 1);
          mesh.material.backFaceCulling = true;
        }
      }

      if (this.game.usingPostProcess)
        this.game.shadowGenerator!.addShadowCaster(mesh);
    });
    consola.info(
      "MESH LOADER | Loaded " + this.mapModels.meshes.length + " meshes"
    );
  }
}

export default Models;
