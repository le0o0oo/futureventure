import type Engine from "../../Engine";
import { Observer, Scene, Vector3, type FreeCamera } from "babylonjs";
import funcs from "~/utils/generalFuncs";
import assistant from "~/utils/assistant";
import { eventBus } from "~/event-bus";

export default async (game: Engine) => {
  const camera = game.getCamera() as FreeCamera;

  const generalData = useGeneralStore();
  const loading = useLoadingStore();

  assistant.say("Fantastico!", {
    duration: 3000,
    icon: "happy",
  });

  await funcs.delay(2000);

  assistant.say("Adesso grazie a te i droni sono tornati a funzionare!", {
    duration: 3000,
    icon: "happy",
  });

  await funcs.delay(6000);

  assistant.say("Andiamo a vedere altro!", {
    duration: 4000,
    icon: "happy",
  });

  await funcs.delay(3000);

  generalData.activeControls = false;
  generalData.cameraFollow = false;

  const targetPosition = new Vector3(-4.73, 2.86, -42.64);

  const rotation = new Vector3(funcs.degToRad(14.95), funcs.degToRad(194), 0);

  await funcs.moveCamera({
    camera,
    game,
    targetPosition: new Vector3(5.79, 21.34, 31),
    targetRotation: rotation,
    speed: 0.03,
  });

  camera.rotation = rotation;

  await funcs.delay(1500);

  await funcs.moveCamera({
    camera,
    game,
    targetPosition,
    targetRotation: rotation,
    speed: 0.1,
  });

  loading.isLoading = true;
  camera.position = new Vector3(0, 0, 0);

  eventBus.dispatchEvent(new Event("load-satellite_control"));
};
