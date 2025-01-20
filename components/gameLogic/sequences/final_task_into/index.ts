import type Engine from "../../Engine";
import { Observer, Scene, Vector3, type FreeCamera } from "babylonjs";
import funcs from "~/utils/generalFuncs";
import assistant from "~/utils/assistant";
import utilsMeshes from "~/utils/utilsMeshes";
import { eventBus } from "~/event-bus";
import audioManager from "~/utils/audioManager";

let game: Engine;

function waitForProg(infoStore: any): Promise<void> {
  return new Promise((resolve) => {
    const unwatch = watch(
      () => infoStore.progress.progressState,
      (newValue) => {
        if (newValue === 0) {
          unwatch(); // Stop watching once the condition is met
          resolve();
        }
      }
    );
  });
}

async function sequence() {
  const tasksStore = useTasksStore();
  const gameState = useGameStateStore();
  const generalData = useGeneralStore();
  const infoStore = useInfoStore();
  const loading = useLoadingStore();
  const sharedData = useSharedData();

  const camera = game.getCamera() as FreeCamera;

  // await funcs.delay(3000);

  if (gameState.currentMap != "nasa") {
    eventBus.dispatchEvent(new CustomEvent("to_nasa", { detail: sequence }));
    return;
  }

  if (!audioManager.playing) audioManager.playMusic("music2");

  camera.position = new Vector3(5.267, 3.984, -6.074);
  camera.rotation = new Vector3(
    funcs.degToRad(8.62),
    funcs.degToRad(273.89),
    0
  );

  assistant.say("Direi che è il momento per il tuo compito finale", {
    duration: 4000,
    icon: "normal",
  });

  await funcs.delay(2000);

  if (sharedData.runAllScenes) {
    loading.isLoading = true;
    await funcs.delay(800);
    eventBus.dispatchEvent(
      new CustomEvent("runScene", {
        detail: "final_task",
      } as CustomEventInit)
    );
  }
}

export default async (cGame: Engine) => {
  game = cGame;
  sequence();
};
