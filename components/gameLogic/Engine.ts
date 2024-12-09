import * as BABYLON from "babylonjs";
import HavokPhysics from "@babylonjs/havok";
import { type HavokPhysicsWithBindings } from "@babylonjs/havok";

class Engine {
  engine: BABYLON.Engine;
  scene: BABYLON.Scene;
  // If physics is enabled in the current engine
  usingPhysics: boolean = false;

  private cameras: BABYLON.Camera[] | BABYLON.FreeCamera[] = [];

  private renderScene() {
    this.scene.render();
  }

  private handleResize() {
    this.engine.resize();
  }

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new BABYLON.Engine(this.canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    });
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.collisionsEnabled = true;

    // Skybox
    var skybox = BABYLON.MeshBuilder.CreateBox(
      "skyBox",
      { size: 1000.0 },
      this.scene
    );
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
      "textures/skybox/skybox",
      this.scene
    );
    skyboxMaterial.reflectionTexture.coordinatesMode =
      BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;

    this.engine.runRenderLoop(() => {
      if (this.cameras.length > 0) this.renderScene();
    });
    window.addEventListener("resize", () => this.handleResize());
    canvas.focus();
    canvas.onblur = () => {
      console.log("Focus is lost");
      canvas.focus();
    };
  }

  async initPhysics() {
    this.scene.enablePhysics(
      null,
      new BABYLON.HavokPlugin(true, await HavokPhysics())
    );
    this.usingPhysics = true;
  }

  addCamera(camera: BABYLON.Camera | BABYLON.FreeCamera) {
    //@ts-ignore
    this.cameras.push(camera);
    //this.scene.activeCameras?.push(camera);
  }
  getCamera(index: number = 0) {
    return this.cameras[0];
  }
}

export default Engine;
