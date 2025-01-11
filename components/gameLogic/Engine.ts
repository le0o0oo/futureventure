import * as BABYLON from "babylonjs";
import HavokPhysics from "@babylonjs/havok";
import { type HavokPhysicsWithBindings } from "@babylonjs/havok";
import type Models from "./Models";

class Engine {
  engine: BABYLON.Engine;
  scene: BABYLON.Scene;
  // If physics is enabled in the current engine
  usingPhysics: boolean = false;
  usingPostProcess: boolean = false;

  shadowGenerator?: BABYLON.ShadowGenerator;
  light?: BABYLON.DirectionalLight;

  models?: Models;

  canvasElement: HTMLCanvasElement;

  private cameras: BABYLON.Camera[] | BABYLON.FreeCamera[] = [];

  private renderScene() {
    this.scene.render();
  }

  private handleResize() {
    this.engine.resize();
  }

  constructor(private canvas: HTMLCanvasElement) {
    const tasksStore = useTasksStore();

    this.engine = new BABYLON.Engine(this.canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    });
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.collisionsEnabled = true;

    this.canvasElement = canvas;

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
      if (tasksStore.showMinigame) return;
      console.log("Focus is lost");
      canvas.focus();
    };
  }
  initLighting() {
    this.scene.shadowsEnabled = true;
    this.scene.imageProcessingConfiguration.toneMappingEnabled = true;
    this.scene.imageProcessingConfiguration.toneMappingType =
      BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;
    this.scene.clearColor = new BABYLON.Color4(1, 1, 1, 1);
    this.scene.ambientColor = new BABYLON.Color3(0.6, 0.6, 0.6);

    this._setupPostProcessEffects(this.getCamera()!);

    const skySun = new BABYLON.DirectionalLight(
      "skySun",
      new BABYLON.Vector3(0, 0, 0),
      this.scene
    );
    skySun.direction = new BABYLON.Vector3(-0.797, -0.604, 0);
    skySun.intensity = 6;
    skySun.shadowEnabled = true;
    skySun.autoCalcShadowZBounds = true;
    this.shadowGenerator = new BABYLON.ShadowGenerator(1024, skySun);
    this.shadowGenerator.setDarkness(0);
    this.shadowGenerator.filter =
      BABYLON.ShadowGenerator.FILTER_BLURCLOSEEXPONENTIALSHADOWMAP;
    this.shadowGenerator.transparencyShadow = true;

    this.usingPostProcess = true;

    // const hemisphericLight = new BABYLON.HemisphericLight(
    //   "light1",
    //   new BABYLON.Vector3(0, 1, 0),
    //   this.scene
    // );
    // hemisphericLight.intensity = 0.5;
    // this.light = new BABYLON.DirectionalLight(
    //   "dirLight",
    //   new BABYLON.Vector3(0, -3, 0),
    //   this.scene
    // );
    // this.light.intensity = 1;
    // (this.light as BABYLON.IShadowLight).shadowMaxZ = 6;

    // const envTexture = new BABYLON.CubeTexture(
    //   "textures/skybox/skybox",
    //   this.scene
    // );

    // const forceGeometryBuffer = false;
    // const useMSAA = true;

    // // Create the SSR post-process!
    // const ssr = new BABYLON.SSRRenderingPipeline(
    //   "ssr",
    //   this.scene,
    //   [this.scene.activeCamera!],
    //   forceGeometryBuffer,
    //   BABYLON.Constants.TEXTURETYPE_UNSIGNED_BYTE
    // );
    // //ssr.isEnabled = false;

    // ssr.environmentTexture = envTexture;
    // ssr.strength = 1;
    // ssr.reflectionSpecularFalloffExponent = 1;
    // ssr.enableAutomaticThicknessComputation = true;
    // ssr.thickness = 0; // 2.5
    // ssr.step = 3;
    // ssr.blurDispersionStrength = 0;
    // ssr.roughnessFactor = 0;
    // ssr.enableSmoothReflections = true;

    // if (useMSAA) {
    //   if (forceGeometryBuffer) {
    //     ssr.samples = 4;
    //   } else {
    //     new BABYLON.FxaaPostProcess("fxaa", 1, this.getCamera());
    //   }
    // }

    // //@ts-ignore
    // window.ssr = ssr;

    // this.shadowGenerator = new BABYLON.ShadowGenerator(
    //   1024,
    //   this.light as BABYLON.IShadowLight
    // );
  }

  async initPhysics() {
    this.scene.enablePhysics(
      new BABYLON.Vector3(0, -10, 0),
      new BABYLON.HavokPlugin(true, await HavokPhysics())
    );
    this.usingPhysics = true;
  }

  addCamera(camera: BABYLON.Camera | BABYLON.FreeCamera) {
    //@ts-ignore
    this.cameras.push(camera);
    // var postProcess = new BABYLON.ColorCorrectionPostProcess(
    //   "color_correction",
    //   "/color_grading_saturated.png",
    //   1.0,
    //   camera
    // );
    //this.scene.activeCameras?.push(camera);
  }
  getCamera(index: number = 0) {
    return this.cameras[0];
  }

  private _setupPostProcessEffects(camera: BABYLON.Camera) {
    if (!this.scene) {
      throw new Error("No scene");
    }

    const defaultPipeline = new BABYLON.DefaultRenderingPipeline(
      "default",
      false,
      this.scene,
      [camera]
    );
    defaultPipeline.fxaaEnabled = true;
    defaultPipeline.glowLayerEnabled = true;
    if (defaultPipeline.glowLayerEnabled)
      defaultPipeline.glowLayer!.blurKernelSize = 40;

    if (BABYLON.SSAO2RenderingPipeline.IsSupported) {
      const ssao = new BABYLON.SSAO2RenderingPipeline("ssao", this.scene, 0.5, [
        camera,
      ]);

      ssao.totalStrength = 2;
      ssao.base = 0;
      ssao.radius = 1.0;
      ssao.epsilon = 0.02;
      ssao.samples = 16;
      ssao.maxZ = 250;
      ssao.minZAspect = 0.5;
      ssao.expensiveBlur = true;
      ssao.bilateralSamples = 16;
      ssao.bilateralSoften = 1;
      ssao.bilateralTolerance = 0.5;
    }

    {
      const ssr = new BABYLON.SSRRenderingPipeline(
        "ssr",
        this.scene,
        [camera],
        false,
        BABYLON.Constants.TEXTURETYPE_UNSIGNED_BYTE
      );

      ssr.thickness = 0.1;
      ssr.selfCollisionNumSkip = 2;
      //ssr.enableAutomaticThicknessComputation = true;
      ssr.blurDispersionStrength = 0.03;
      ssr.roughnessFactor = 0.1;
      ssr.enableSmoothReflections = true;
      ssr.step = 1;
      ssr.maxSteps = 2000;
      ssr.maxDistance = 1000;
      ssr.blurDownsample = 0;
      ssr.ssrDownsample = 0;

      //ssr.isEnabled = false;
    }
  }
}

export default Engine;
