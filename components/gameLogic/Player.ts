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

  mesh: BABYLON.AbstractMesh;
  aggregate: BABYLON.PhysicsAggregate;

  constructor(meshLoaderResult: BABYLON.ISceneLoaderAsyncResult, game: Engine) {
    this.game = game;
    const playerMesh = meshLoaderResult.meshes[0];
    playerMesh!.rotate(
      BABYLON.Axis.Y,
      funcs.degToRad(-90),
      BABYLON.Space.WORLD
    );
    this.mesh = playerMesh as BABYLON.AbstractMesh;
    playerMesh?.translate(BABYLON.Axis.Y, 2, BABYLON.Space.WORLD);
    playerMesh?.scaling.setAll(0.8);

    var playerAggregate = new BABYLON.PhysicsAggregate(
      playerMesh!,
      BABYLON.PhysicsShapeType.SPHERE,
      { mass: 1, restitution: 0.75, friction: 5 },
      game.scene
    );
    this.aggregate = playerAggregate;
    playerAggregate.body.disablePreStep = false;
    meshLoaderResult.animationGroups.forEach((animation) => {
      animation.start(true);
    });

    this.registerKeybinds();

    this.sceneObserver = game.scene.onBeforeRenderObservable.add(() => {
      this.focusCameraOnPlayer();
      this.doMovement();
    });
  }

  dispose() {
    this.game.scene.onBeforeRenderObservable.remove(this.sceneObserver);
    this.game.scene.actionManager.unregisterAction(this.keydownAction!);
    this.game.scene.actionManager.unregisterAction(this.keyupAction!);
    this.aggregate.dispose();
    this.mesh.dispose();
  }

  private focusCameraOnPlayer() {
    this.game.getCamera()!.position.x = this.mesh!.position.x;
    this.game.getCamera()!.position.y = this.mesh!.position.y + 20;
    this.game.getCamera()!.position.z = this.mesh!.position.z - 20;
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
      this.mesh!.rotation = new BABYLON.Vector3(0, funcs.degToRad(0), 0);
      this.mesh?.moveWithCollisions(
        this.mesh.forward.scaleInPlace(config.public.speed)
      );
      this.movingUp = true;
    } else this.movingUp = false;

    if (this.keyStatus.down) {
      this.mesh!.rotation = new BABYLON.Vector3(0, funcs.degToRad(180), 0);
      this.mesh?.moveWithCollisions(
        new BABYLON.Vector3(0, 0, -config.public.speed)
      );
    }

    if (this.keyStatus.left) {
      if (!this.movingUp) {
        this.mesh!.rotation = new BABYLON.Vector3(
          0,
          funcs.degToRad(-90 - 45),
          0
        );

        // Apply horizontal force to prevent diagonal movement
        this.mesh?.movePOV(config.public.speed * -1, 0, 0);
      } else {
        this.mesh!.rotation = new BABYLON.Vector3(0, funcs.degToRad(-45), 0);
      }

      this.mesh?.moveWithCollisions(
        this.mesh.forward.scaleInPlace(config.public.speed)
      );
    }

    if (this.keyStatus.right) {
      if (!this.movingUp) {
        this.mesh!.rotation = new BABYLON.Vector3(
          0,
          funcs.degToRad(90 + 45),
          0
        );

        // Apply horizontal force to prevent diagonal movement
        this.mesh?.movePOV(config.public.speed, 0, 0);
      } else {
        this.mesh!.rotation = new BABYLON.Vector3(0, funcs.degToRad(45), 0);
      }

      this.mesh?.moveWithCollisions(
        this.mesh.forward.scaleInPlace(config.public.speed)
      );
    }
  }
}

export default Player;
