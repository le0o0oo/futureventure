import type Engine from "../../Engine";
import { Observer, Scene, Vector3, type FreeCamera } from "babylonjs";
import funcs from "~/utils/generalFuncs";

export default (game: Engine) => {
  const camera = game.getCamera() as FreeCamera;

  const generalData = useGeneralStore();

  generalData.cameraFollow = false;
  // camera.rotation.x = funcs.degToRad(24);
  // camera.rotation.y = funcs.degToRad(168);
  camera.rotation = new Vector3(funcs.degToRad(19.73), funcs.degToRad(170), 0);

  camera.position = new Vector3(-57.18, 19, 98);

  const targetPosition = new Vector3(42.17, 27.46, 80.57);
  const targetRotation = new Vector3(
    funcs.degToRad(18.15),
    funcs.degToRad(237.13),
    0
  );

  let observer: Observer<Scene>;

  setTimeout(() => {
    const animSpeed = 0.1; // Speed factor, adjust this for faster/slower movement
    const targetDirection = targetPosition
      .subtract(camera.position)
      .normalize(); // Direction to move in
    const distanceToTarget = camera.position.subtract(targetPosition).length(); // Distance to the target position

    observer = game.scene.onBeforeRenderObservable.add(() => {
      // Move the camera at a constant speed
      const distanceThisFrame =
        animSpeed * game.scene.getEngine().getDeltaTime(); // Speed is multiplied by time delta
      const newDistanceToTarget = camera.position
        .subtract(targetPosition)
        .length();

      if (newDistanceToTarget > distanceThisFrame) {
        camera.position = camera.position.add(
          targetDirection.scale(distanceThisFrame)
        ); // Move the camera towards the target
      } else {
        camera.position = targetPosition; // Snap to target once we are close enough
        game.scene.onBeforeRenderObservable.remove(observer);
        console.log("Animation end");
      }

      // Rotate the camera at a constant speed
      const rotationSpeed = 0.05; // Adjust rotation speed
      camera.rotation = camera.rotation.add(
        targetRotation.subtract(camera.rotation).scale(rotationSpeed)
      );
    });
  }, 1000);

  camera.attachControl();
};
