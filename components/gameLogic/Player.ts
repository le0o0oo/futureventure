import * as BABYLON from "babylonjs";
import type Engine from "./Engine";
import funcs from "~/utils/generalFuncs";
import Models from "./Models";
const config = useRuntimeConfig();

class Player {
  private game: Engine;
  private keyStatus = {
    up: false,
    down: false,
    left: false,
    right: false,
  };
  private movingUp = false;
  private sceneObserver: BABYLON.Observer<BABYLON.Scene>;
  private keydownAction?: BABYLON.Nullable<BABYLON.IAction>;
  private keyupAction?: BABYLON.Nullable<BABYLON.IAction>;
  private targetRotation: BABYLON.Vector3 = new BABYLON.Vector3(
    0,
    funcs.degToRad(180),
    0
  );
  private targetZRotation: number = 0; // In degrees
  private models: Models;

  private raycastYOffset = 0.3;
  private raycastXOffset = 0;
  private raycastXLength = 0.3;
  private raycastHit = false;

  private inSight: boolean = false;

  mesh: BABYLON.Mesh;
  aggregate?: BABYLON.PhysicsAggregate;

  constructor(meshLoaderResult: BABYLON.ISceneLoaderAsyncResult, game: Engine) {
    this.game = game;
    this.models = new Models(game);
    const playerMesh = meshLoaderResult.meshes[0];
    playerMesh!.rotate(
      BABYLON.Axis.Y,
      funcs.degToRad(-90),
      BABYLON.Space.WORLD
    );
    this.mesh = playerMesh as BABYLON.Mesh;
    //playerMesh?.translate(BABYLON.Axis.Y, 0.1, BABYLON.Space.WORLD);
    playerMesh!.position.y = 0.2;
    playerMesh?.scaling.setAll(0.2);
    //playerMesh.applyGravity = true;

    if (this.game.scene._physicsEngine) {
      var playerAggregate = new BABYLON.PhysicsAggregate(
        playerMesh!,
        BABYLON.PhysicsShapeType.CAPSULE,
        { mass: 1, restitution: 0.75, friction: 5, radius: 0.2 },
        game.scene
      );
      this.aggregate = playerAggregate;
      playerAggregate.body.disablePreStep = false;
    }

    meshLoaderResult.animationGroups.forEach((animation) => {
      animation.start(true);
    });

    this.registerKeybinds();
    this.sceneObserver = game.scene.onBeforeRenderObservable.add(() => {
      this.inSight = !this.models.ProjectRaycast({
        start: new BABYLON.Vector3(
          this.mesh.position.x + this.raycastXOffset,
          this.mesh.position.y + this.raycastYOffset,
          this.mesh.position.z
        ),
        end: new BABYLON.Vector3(
          this.mesh!.position.x,
          this.mesh!.position.y + 5,
          this.mesh!.position.z - 5
        ),
        debugDraw: false,
        debugTimeout: 50,
      }).hasHit;

      this.updateRaycastRotation();
      playerAggregate.body.setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
      playerAggregate.body.setAngularDamping(0);
      if (this.targetRotation) {
        this.targetRotation.x = 0;
        this.targetRotation.z = 0;
      }
      if (this.targetRotation) this.mesh!.rotation = this.targetRotation;

      const generalData = useGeneralStore();

      if (generalData.cameraFollow) this.focusCameraOnPlayer();
      this.doMovement();

      // if (this.game.light) {
      //   this.game.light.position.x = this.mesh!.position.x;
      //   this.game.light.position.y = this.mesh!.position.y + 5;
      //   this.game.light.position.z = this.mesh!.position.z;
      // }
    });
  }

  public dispose() {
    this.game.scene.onBeforeRenderObservable.remove(this.sceneObserver);
    this.game.scene.actionManager.unregisterAction(this.keydownAction!);
    this.game.scene.actionManager.unregisterAction(this.keyupAction!);
    this.aggregate?.dispose();
    this.mesh.dispose();
  }

  private updateRaycastRotation() {
    // Create a forward vector pointing along the z-axis (local space)
    const forwardDirection = new BABYLON.Vector3(0, 0, 1);

    // Create a rotation matrix from the mesh's rotation along the Y-axis
    const rotationMatrix = BABYLON.Matrix.RotationYawPitchRoll(
      this.mesh.rotation.y,
      0,
      0
    );

    // Apply the rotation matrix to the forward vector to get the world-space direction
    const worldForwardDirection = BABYLON.Vector3.TransformCoordinates(
      forwardDirection,
      rotationMatrix
    );

    // Now use this world-forward direction for the raycast
    this.raycastHit = this.models.ProjectRaycast({
      start: new BABYLON.Vector3(
        this.mesh.position.x + this.raycastXOffset,
        this.mesh.position.y + this.raycastYOffset,
        this.mesh.position.z
      ),
      end: new BABYLON.Vector3(
        this.mesh.position.x + worldForwardDirection.x * this.raycastXLength,
        this.mesh.position.y + this.raycastYOffset,
        this.mesh.position.z + worldForwardDirection.z * this.raycastXLength
      ),
      debugDraw: false,
      debugTimeout: 20,
    }).hasHit;

    // console.log(
    //   this.models.ProjectRaycast({
    //     start: new BABYLON.Vector3(
    //       this.mesh.position.x + this.raycastXOffset,
    //       this.mesh.position.y + this.raycastYOffset,
    //       this.mesh.position.z
    //     ),
    //     end: new BABYLON.Vector3(
    //       this.mesh.position.x,
    //       this.mesh.position.y,
    //       this.mesh.position.z
    //     ),
    //     debugDraw: true,
    //     debugTimeout: 20,
    //   }).body?.transformNode.id !== "__root__"
    // );
    //console.log(hasHit);
  }

  private focusCameraOnPlayer() {
    const camera = this.game.getCamera()!;
    const targetPosition = new BABYLON.Vector3(
      this.mesh.position.x,
      this.mesh.position.y + (this.inSight ? 5 : 1),
      this.mesh.position.z + (this.inSight ? -5 : -2)
    );
    const currentCameraPosition = camera.position;

    camera.position = BABYLON.Vector3.Lerp(
      currentCameraPosition,
      targetPosition,
      0.1
    );

    const targetRotation = this.inSight
      ? funcs.degToRad(140) // Target rotation when in sight
      : funcs.degToRad(160); // Target rotation when out of sight

    //@ts-ignore
    camera.rotation.x = BABYLON.Scalar.Lerp(
      //@ts-ignore
      camera.rotation.x,
      targetRotation,
      0.1
    );
  }

  private registerKeybinds() {
    this.game.scene.actionManager = new BABYLON.ActionManager(this.game.scene);
    this.keydownAction = this.game.scene.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnKeyDownTrigger,
        (ev) => {
          const key = ev.sourceEvent.key;

          if (config.public.keybinds.down.includes(key))
            this.keyStatus.down = true;
          if (config.public.keybinds.up.includes(key)) this.keyStatus.up = true;
          if (config.public.keybinds.left.includes(key))
            this.keyStatus.left = true;
          if (config.public.keybinds.right.includes(key))
            this.keyStatus.right = true;
        }
      )
    );
    this.keyupAction = this.game.scene.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnKeyUpTrigger,
        (ev) => {
          const key = ev.sourceEvent.key;

          if (config.public.keybinds.down.includes(key))
            this.keyStatus.down = false;
          if (config.public.keybinds.up.includes(key))
            this.keyStatus.up = false;
          if (config.public.keybinds.left.includes(key))
            this.keyStatus.left = false;
          if (config.public.keybinds.right.includes(key))
            this.keyStatus.right = false;
        }
      )
    );
  }

  private doMovement() {
    // Doing all of this because the rotation on left and right is not 90, so when i apply a force forward, i get diagonal movement.
    // To fix it, I'm applying also horizontal movement

    // Forward: Robot facing away from the camera
    if (this.keyStatus.up) {
      this.targetZRotation = 0;
      this.targetRotation = new BABYLON.Vector3(
        0,
        funcs.degToRad(this.targetZRotation),
        0
      );
      this.mesh!.rotation = this.targetRotation;
      if (!this.raycastHit) this.mesh.movePOV(0, 0, config.public.speed * -1);
      // this.mesh?.moveWithCollisions(
      //   this.mesh.forward.scaleInPlace(config.public.speed)
      // );
      this.movingUp = true;
    } else this.movingUp = false;

    if (this.keyStatus.down) {
      this.targetZRotation = 180;
      this.targetRotation = new BABYLON.Vector3(
        0,
        funcs.degToRad(this.targetZRotation),
        0
      );
      this.mesh!.rotation = this.targetRotation;
      if (!this.raycastHit) this.mesh.movePOV(0, 0, config.public.speed * -1);

      // this.mesh?.moveWithCollisions(
      //   new BABYLON.Vector3(0, 0, -config.public.speed)
      // );
    }

    if (this.keyStatus.left) {
      if (!this.movingUp) {
        this.targetZRotation = funcs.degToRad(-90 - 45);
        this.targetRotation = new BABYLON.Vector3(0, this.targetZRotation, 0);
        this.mesh!.rotation = this.targetRotation;

        // Apply horizontal force to prevent diagonal movement
        if (!this.raycastHit)
          this.mesh?.movePOV(config.public.speed * -1, 0, 0);
        // this.mesh?.moveWithCollisions(
        //   this.mesh.right.scaleInPlace(config.public.speed)
        // );
      } else {
        this.targetZRotation = funcs.degToRad(-45);
        this.targetRotation = new BABYLON.Vector3(0, this.targetZRotation, 0);
        this.mesh!.rotation = this.targetRotation;
      }

      this.mesh.movePOV(0, 0, config.public.speed * -1);
      // this.mesh?.moveWithCollisions(
      //   this.mesh.forward.scaleInPlace(config.public.speed)
      // );
    }

    if (this.keyStatus.right) {
      if (!this.movingUp) {
        this.targetZRotation = funcs.degToRad(90 + 45);
        this.targetRotation = new BABYLON.Vector3(0, this.targetZRotation, 0);
        this.mesh!.rotation = this.targetRotation;

        // Apply horizontal force to prevent diagonal movement
        if (!this.raycastHit) this.mesh?.movePOV(config.public.speed, 0, 0);
        // this.mesh?.moveWithCollisions(
        //   this.mesh.right.scaleInPlace(config.public.speed * -1)
        // );
      } else {
        this.targetZRotation = funcs.degToRad(45);
        this.targetRotation = new BABYLON.Vector3(0, this.targetZRotation, 0);
        this.mesh!.rotation = this.targetRotation;
      }

      if (!this.raycastHit) this.mesh.movePOV(0, 0, config.public.speed * -1);

      // this.mesh?.moveWithCollisions(
      //   this.mesh.forward.scaleInPlace(config.public.speed)
      // );
    }
  }
}

export default Player;
