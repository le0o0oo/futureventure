import * as BABYLON from "babylonjs";
import type Engine from "./Engine";
import funcs from "~/utils/generalFuncs";
import Models from "./Models";
import interactionManager from "~/utils/interactionManager";
import utilsMeshes from "~/utils/utilsMeshes";

const config = useRuntimeConfig();
const generalData = useGeneralStore();

class Player_robot {
  private game: Engine;
  private keyStatus = {
    up: false,
    down: false,
    left: false,
    right: false,

    space: false,
    shift: false,
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

  private delta: number = 0;
  private droneSpeedAdd = 0.02;

  public type = "drone";

  mesh: BABYLON.Mesh;
  aggregate?: BABYLON.PhysicsAggregate;

  private tasksStore = useTasksStore();

  constructor(
    meshLoaderResult: BABYLON.ISceneLoaderAsyncResult,
    game: Engine,
    coords: BABYLON.Vector3
  ) {
    this.game = game;
    this.models = new Models(game);

    const sharedData = useSharedData();
    const playerMesh = meshLoaderResult.meshes[0];
    // playerMesh!.rotate(
    //   BABYLON.Axis.Y,
    //   funcs.degToRad(-90),
    //   BABYLON.Space.WORLD
    // );
    playerMesh!.position = coords;

    this.mesh = playerMesh as BABYLON.Mesh;
    //@ts-ignore
    utilsMeshes.currentPlayer = this.mesh;

    // Player mesh setup
    // playerMesh?.scaling.setAll(0.2);
    playerMesh!.rotation.x = funcs.degToRad(45);

    // Player physics setup
    if (this.game.scene._physicsEngine) {
      var playerAggregate = new BABYLON.PhysicsAggregate(
        playerMesh!,
        BABYLON.PhysicsShapeType.CAPSULE,
        { mass: 0, restitution: 0.75, friction: 5, radius: 0.2 },
        game.scene
      );
      this.aggregate = playerAggregate;
      playerAggregate.body.disablePreStep = false;
    }

    this.registerKeybinds();
    this.sceneObserver = game.scene.onBeforeRenderObservable.add(() => {
      this.delta = this.game.engine.getDeltaTime() / 20;

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
      if (sharedData.cameraInSight != this.inSight)
        sharedData.cameraInSight = this.inSight;

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
      //if (generalData.activeControls) this.doMovement();
      this.detectInteractable();

      playerMesh!.rotation.x = funcs.degToRad(10);
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
  }

  private detectInteractable() {
    // Projects a "box" made with raycasts like this
    /* 
    ---------------
    |             |
    |             |
    |      o      | <- This is the player
    |             |
    |             |
    ---------------
    */
    const boxOffset = 0.6;
    const deeBug = false;

    const startTopPos = new BABYLON.Vector3(
      this.mesh.position.x + boxOffset,
      this.mesh.position.y + 0.1,
      this.mesh.position.z + boxOffset
    );

    var rayRight = new BABYLON.Ray(
      startTopPos,
      new BABYLON.Vector3(0, 0, -1),
      boxOffset * 2
    );

    var rightHit = this.game.scene.pickWithRay(rayRight);

    // ------------ TOP ----------------

    var rayTop = new BABYLON.Ray(
      startTopPos,
      new BABYLON.Vector3(-1, 0, 0),
      boxOffset * 2
    );

    var topHit = this.game.scene.pickWithRay(rayTop);

    // ------------ BOTTOM ----------------

    const startBottomPos = new BABYLON.Vector3(
      this.mesh.position.x - boxOffset,
      this.mesh.position.y + 0.1,
      this.mesh.position.z - boxOffset
    );

    var rayBottom = new BABYLON.Ray(
      startBottomPos,
      new BABYLON.Vector3(1, 0, 0),
      boxOffset * 2
    );

    var bottomHit = this.game.scene.pickWithRay(rayBottom);

    // ------------ LEFT ----------------

    var rayLeft = new BABYLON.Ray(
      startBottomPos,
      new BABYLON.Vector3(0, 0, 1),
      boxOffset * 2
    );

    var leftHit = this.game.scene.pickWithRay(rayLeft);

    if (leftHit?.pickedMesh) {
      if (interactionManager.isSpecialMesh(leftHit.pickedMesh.name))
        interactionManager.handleMesh(leftHit.pickedMesh);
    } else if (rightHit?.pickedMesh) {
      if (interactionManager.isSpecialMesh(rightHit.pickedMesh.name))
        interactionManager.handleMesh(rightHit.pickedMesh);
    } else if (bottomHit?.pickedMesh) {
      if (interactionManager.isSpecialMesh(bottomHit.pickedMesh.name))
        interactionManager.handleMesh(bottomHit.pickedMesh);
    } else if (topHit?.pickedMesh) {
      if (interactionManager.isSpecialMesh(topHit.pickedMesh.name))
        interactionManager.handleMesh(topHit.pickedMesh);
    } else {
      if (this.tasksStore.showMessage) this.tasksStore.showMessage = false;
      if (this.tasksStore.doingTask) this.tasksStore.doingTask = false;
      if (this.tasksStore.showMinigame) this.tasksStore.showMinigame = false;
    }

    if (deeBug) {
      let rayTopHelper = new BABYLON.RayHelper(rayTop);
      rayTopHelper.show(this.game.scene);

      let rayRightHelper = new BABYLON.RayHelper(rayRight);
      rayRightHelper.show(this.game.scene);

      let rayBottomHelper = new BABYLON.RayHelper(rayBottom);
      rayBottomHelper.show(this.game.scene);

      let rayLeftHelper = new BABYLON.RayHelper(rayLeft);
      rayLeftHelper.show(this.game.scene);
      this.game.scene.onAfterRenderObservable.addOnce(() => {
        rayRightHelper.hide();
        rayRightHelper.dispose();

        rayTopHelper.hide();
        rayTopHelper.dispose();

        rayBottomHelper.hide();
        rayBottomHelper.dispose();

        rayLeftHelper.hide();
        rayLeftHelper.dispose();
      });
    }
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
      0.1 * this.delta
    );

    const targetRotation = this.inSight
      ? funcs.degToRad(140) // Target rotation when in sight
      : funcs.degToRad(160); // Target rotation when out of sight

    //@ts-ignore
    camera.rotation.x = BABYLON.Scalar.Lerp(
      //@ts-ignore
      camera.rotation.x,
      targetRotation,
      0.1 * this.delta
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

          if (key == " ") this.keyStatus.space = true;
          if (key == "Shift") this.keyStatus.shift = true;
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

          if (key == " ") this.keyStatus.space = false;
          if (key == "Shift") this.keyStatus.shift = false;
        }
      )
    );
  }

  private doMovement() {
    // Doing all of this because the rotation on left and right is not 90, so when i apply a force forward, i get diagonal movement.
    // To fix it, I'm applying also horizontal movement

    if (this.keyStatus.space) {
      this.mesh.movePOV(
        0,
        (config.public.speed + this.droneSpeedAdd) * this.delta,
        0
      );
    }

    if (this.keyStatus.shift) {
      this.mesh.movePOV(
        0,
        (config.public.speed + this.droneSpeedAdd) * -1 * this.delta,
        0
      );
    }

    if (this.keyStatus.up) {
      this.targetZRotation = 0;
      this.targetRotation = new BABYLON.Vector3(
        0,
        funcs.degToRad(this.targetZRotation),
        0
      );
      this.mesh!.rotation = this.targetRotation;
      if (!this.raycastHit)
        this.mesh.movePOV(
          0,
          0,
          (config.public.speed + this.droneSpeedAdd) * -1 * this.delta
        );
      // this.mesh?.moveWithCollisions(
      //   this.mesh.forward.scaleInPlace((config.public.speed + this.droneSpeedAdd))
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
      if (!this.raycastHit)
        this.mesh.movePOV(
          0,
          0,
          (config.public.speed + this.droneSpeedAdd) * -1 * this.delta
        );

      // this.mesh?.moveWithCollisions(
      //   new BABYLON.Vector3(0, 0, -(config.public.speed + this.droneSpeedAdd))
      // );
    }

    if (this.keyStatus.left) {
      if (!this.movingUp) {
        this.targetZRotation = funcs.degToRad(-90 - 45);
        this.targetRotation = new BABYLON.Vector3(0, this.targetZRotation, 0);
        this.mesh!.rotation = this.targetRotation;

        // Apply horizontal force to prevent diagonal movement
        if (!this.raycastHit)
          this.mesh?.movePOV(
            (config.public.speed + this.droneSpeedAdd) * -1 * this.delta,
            0,
            0
          );
        // this.mesh?.moveWithCollisions(
        //   this.mesh.right.scaleInPlace((config.public.speed + this.droneSpeedAdd))
        // );
      } else {
        this.targetZRotation = funcs.degToRad(-45);
        this.targetRotation = new BABYLON.Vector3(0, this.targetZRotation, 0);
        this.mesh!.rotation = this.targetRotation;
      }

      if (!this.raycastHit)
        this.mesh.movePOV(
          0,
          0,
          (config.public.speed + this.droneSpeedAdd) * -1 * this.delta
        );
      // this.mesh?.moveWithCollisions(
      //   this.mesh.forward.scaleInPlace((config.public.speed + this.droneSpeedAdd))
      // );
    }

    if (this.keyStatus.right) {
      if (!this.movingUp) {
        this.targetZRotation = funcs.degToRad(90 + 45);
        this.targetRotation = new BABYLON.Vector3(0, this.targetZRotation, 0);
        this.mesh!.rotation = this.targetRotation;

        // Apply horizontal force to prevent diagonal movement
        if (!this.raycastHit)
          this.mesh?.movePOV(
            (config.public.speed + this.droneSpeedAdd) * this.delta,
            0,
            0
          );
        // this.mesh?.moveWithCollisions(
        //   this.mesh.right.scaleInPlace((config.public.speed + this.droneSpeedAdd) * -1)
        // );
      } else {
        this.targetZRotation = funcs.degToRad(45);
        this.targetRotation = new BABYLON.Vector3(0, this.targetZRotation, 0);
        this.mesh!.rotation = this.targetRotation;
      }

      if (!this.raycastHit)
        this.mesh.movePOV(
          0,
          0,
          (config.public.speed + this.droneSpeedAdd) * -1 * this.delta
        );

      // this.mesh?.moveWithCollisions(
      //   this.mesh.forward.scaleInPlace((config.public.speed + this.droneSpeedAdd))
      // );
    }
  }
}

export default Player_robot;
