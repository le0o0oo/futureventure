import { type FreeCamera, Vector3 } from "babylonjs";
import type Engine from "~/components/gameLogic/Engine";

/**
 * Converts degrees to radians.
 * @param deg The angle in degrees.
 * @returns The angle in radians.
 */
const degToRad = (deg: number): number => (deg * Math.PI) / 180;

const radToDeg = (rad: number): number => rad * (180 / Math.PI);

async function moveCamera(data: {
  camera: FreeCamera;
  game: Engine;
  targetPosition: Vector3;
  targetRotation: Vector3;
  speed: number;
}): Promise<void> {
  const animSpeed = data.speed; // Speed factor, adjust this for faster/slower movement
  const camera = data.camera;
  const targetPosition = data.targetPosition;
  const targetRotation = data.targetRotation;
  const game = data.game;

  const targetDirection = targetPosition.subtract(camera.position).normalize(); // Direction to move in
  const distanceToTarget = camera.position.subtract(targetPosition).length(); // Distance to the target position

  return new Promise<void>((resolve) => {
    const observer = game.scene.onBeforeRenderObservable.add(() => {
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
        resolve(); // Resolve the promise once the camera reaches the target
      }

      // Rotate the camera at a constant speed
      const rotationSpeed = 0.05; // Adjust rotation speed
      camera.rotation = camera.rotation.add(
        targetRotation.subtract(camera.rotation).scale(rotationSpeed)
      );
    });
  });
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function atan2FromPoint(x0: number, y0: number, x: number, y: number) {
  return Math.atan2(y - y0, x - x0);
}

type PreloadCallback = (
  loadedImages: HTMLImageElement[],
  errors: string[]
) => void;

function preloadImages(imageUrls: string[], onComplete: PreloadCallback): void {
  const loadedImages: HTMLImageElement[] = [];
  let loadedCount = 0;
  const totalImages = imageUrls.length;
  const errors: string[] = [];

  if (totalImages === 0) {
    onComplete([], []);
    return;
  }

  imageUrls.forEach((url, index) => {
    const img = new Image();

    img.onload = () => {
      loadedImages[index] = img;
      loadedCount++;
      checkCompletion();
    };

    img.onerror = () => {
      errors.push(url);
      loadedCount++;
      checkCompletion();
    };

    img.src = url;
  });

  function checkCompletion(): void {
    if (loadedCount === totalImages) {
      onComplete(loadedImages, errors);
    }
  }
}
type PreloadVideoCallback = (
  loadedVideos: HTMLVideoElement[],
  errors: string[]
) => void;

function preloadVideos(
  videoUrls: string[],
  onComplete: PreloadVideoCallback
): void {
  const loadedVideos: HTMLVideoElement[] = [];
  let loadedCount = 0;
  const totalVideos = videoUrls.length;
  const errors: string[] = [];

  if (totalVideos === 0) {
    onComplete([], []);
    return;
  }

  videoUrls.forEach((url, index) => {
    const video = document.createElement("video");

    video.onloadeddata = () => {
      loadedVideos[index] = video;
      loadedCount++;
      checkCompletion();
    };

    video.onerror = () => {
      errors.push(url);
      loadedCount++;
      checkCompletion();
    };

    video.src = url;
    video.load(); // Start preloading the video
  });

  function checkCompletion(): void {
    if (loadedCount === totalVideos) {
      onComplete(loadedVideos, errors);
    }
  }
}

export default {
  degToRad,
  radToDeg,
  moveCamera,
  delay,
  atan2FromPoint,
  preloadImages,
  preloadVideos,
};
