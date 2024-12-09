import * as BABYLON from "babylonjs";
import type Engine from "./Engine";
import funcs from "~/utils/generalFuncs";
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
  private targetRotation?: BABYLON.Vector3;

  mesh: BABYLON.Mesh;
  aggregate?: BABYLON.PhysicsAggregate;

  constructor(meshLoaderResult: BABYLON.ISceneLoaderAsyncResult, game: Engine) {
    this.game = game;
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
      playerAggregate.body.setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
      playerAggregate.body.setAngularDamping(0);
      if (this.targetRotation) {
        this.targetRotation.x = 0;
        this.targetRotation.z = 0;
      }
      if (this.targetRotation) this.mesh!.rotation = this.targetRotation;

      this.focusCameraOnPlayer();
      this.doMovement();
    });
  }

  dispose() {
    this.game.scene.onBeforeRenderObservable.remove(this.sceneObserver);
    this.game.scene.actionManager.unregisterAction(this.keydownAction!);
    this.game.scene.actionManager.unregisterAction(this.keyupAction!);
    this.aggregate?.dispose();
    this.mesh.dispose();
  }

  private focusCameraOnPlayer() {
    this.game.getCamera()!.position.x = this.mesh!.position.x;
    this.game.getCamera()!.position.y = this.mesh!.position.y + 5;
    this.game.getCamera()!.position.z = this.mesh!.position.z - 5;
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
      this.targetRotation = new BABYLON.Vector3(0, funcs.degToRad(0), 0);
      this.mesh!.rotation = this.targetRotation;
      this.mesh.movePOV(0, 0, config.public.speed * -1);
      // this.mesh?.moveWithCollisions(
      //   this.mesh.forward.scaleInPlace(config.public.speed)
      // );
      this.movingUp = true;
    } else this.movingUp = false;

    if (this.keyStatus.down) {
      this.targetRotation = new BABYLON.Vector3(0, funcs.degToRad(180), 0);
      this.mesh!.rotation = this.targetRotation;
      this.mesh.movePOV(0, 0, config.public.speed * -1);

      // this.mesh?.moveWithCollisions(
      //   new BABYLON.Vector3(0, 0, -config.public.speed)
      // );
    }

    if (this.keyStatus.left) {
      if (!this.movingUp) {
        this.targetRotation = new BABYLON.Vector3(
          0,
          funcs.degToRad(-90 - 45),
          0
        );
        this.mesh!.rotation = this.targetRotation;

        // Apply horizontal force to prevent diagonal movement
        this.mesh?.movePOV(config.public.speed * -1, 0, 0);
        // this.mesh?.moveWithCollisions(
        //   this.mesh.right.scaleInPlace(config.public.speed)
        // );
      } else {
        this.targetRotation = new BABYLON.Vector3(0, funcs.degToRad(-45), 0);
        this.mesh!.rotation = this.targetRotation;
      }

      this.mesh.movePOV(0, 0, config.public.speed * -1);
      // this.mesh?.moveWithCollisions(
      //   this.mesh.forward.scaleInPlace(config.public.speed)
      // );
    }

    if (this.keyStatus.right) {
      if (!this.movingUp) {
        this.targetRotation = new BABYLON.Vector3(
          0,
          funcs.degToRad(90 + 45),
          0
        );
        this.mesh!.rotation = this.targetRotation;

        // Apply horizontal force to prevent diagonal movement
        this.mesh?.movePOV(config.public.speed, 0, 0);
        // this.mesh?.moveWithCollisions(
        //   this.mesh.right.scaleInPlace(config.public.speed * -1)
        // );
      } else {
        this.targetRotation = new BABYLON.Vector3(0, funcs.degToRad(45), 0);
        this.mesh!.rotation = this.targetRotation;
      }

      this.mesh.movePOV(0, 0, config.public.speed * -1);

      // this.mesh?.moveWithCollisions(
      //   this.mesh.forward.scaleInPlace(config.public.speed)
      // );
    }
  }
}

export default Player;
