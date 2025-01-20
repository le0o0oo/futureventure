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
  const gameState = useGameStateStore();
  if (gameState.currentMap != "nasa") {
    eventBus.dispatchEvent(new CustomEvent("to_nasa", { detail: sequence }));
    return;
  }

  const tasksStore = useTasksStore();
  const generalData = useGeneralStore();
  const infoStore = useInfoStore();
  const sharedData = useSharedData();

  const camera = game.getCamera() as FreeCamera;

  // await funcs.delay(3000);

  audioManager.playMusic("music2");
  infoStore.slideState = 1;

  camera.position = new Vector3(5.267, 3.984, -6.074);
  camera.rotation = new Vector3(
    funcs.degToRad(8.62),
    funcs.degToRad(273.89),
    0
  );

  await funcs.delay(2000);

  assistant.say(
    "Adesso stiamo nel centro di controllo della agenzia spaziale nazionale",
    {
      duration: 4000,
      icon: "normal",
    }
  );

  await funcs.delay(2500);

  assistant.say(
    "Sembrano voler monitorare un satellitle sperimentale che comunica con i laser invece che le onde radio",
    {
      duration: 4000,
      icon: "normal",
    }
  );

  await funcs.delay(1000);

  // step 1
  infoStore.showComponent = true;
  infoStore.resetProgress(2);
  infoStore.progress.slideshowPlaying = true;
  infoStore.show = true;

  // step 2
  await waitForProg(infoStore);

  infoStore.slideState++;

  infoStore.resetProgress(5);

  // step 3
  await waitForProg(infoStore);

  infoStore.slideState++;

  infoStore.resetProgress(1.5);

  // step 4
  await waitForProg(infoStore);

  infoStore.slideState++;

  infoStore.resetProgress(1);

  // step 5
  await waitForProg(infoStore);

  infoStore.slideState++;

  infoStore.resetProgress(0.8);

  // step 6
  await waitForProg(infoStore);

  infoStore.slideState++;

  infoStore.resetProgress(1);

  // step 7
  await waitForProg(infoStore);

  infoStore.slideState++;

  infoStore.resetProgress(1.2);

  // step 8
  await waitForProg(infoStore);

  infoStore.slideState++;

  infoStore.resetProgress(1.2);

  // step 9
  await waitForProg(infoStore);

  infoStore.slideState++;

  infoStore.resetProgress(1.2);

  // step 10
  await waitForProg(infoStore);

  infoStore.slideState++;

  infoStore.resetProgress(0.75);

  await waitForProg(infoStore);

  infoStore.show = false;
  infoStore.showComponent = false;

  await funcs.delay(2000);

  if (sharedData.runAllScenes)
    eventBus.dispatchEvent(
      new CustomEvent("runScene", {
        detail: "final_task_intro",
      } as CustomEventInit)
    );
}

export default async (cGame: Engine) => {
  game = cGame;
  sequence();
};
