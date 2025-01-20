import type Engine from "../../Engine";
import { Observer, Scene, Vector3, type FreeCamera } from "babylonjs";
import funcs from "~/utils/generalFuncs";
import assistant from "~/utils/assistant";
import utilsMeshes from "~/utils/utilsMeshes";
import { eventBus } from "~/event-bus";

let game: Engine;

let hasHit = false;

async function sequence() {
  const tasksStore = useTasksStore();
  const gameState = useGameStateStore();
  const generalData = useGeneralStore();
  const infoStore = useInfoStore();
  const finaltaskStore = useFinalTaskStore();
  const loading = useLoadingStore();

  const camera = game.getCamera() as FreeCamera;

  camera.attachControl(game.canvasElement, true);

  const runDialog = false || !generalData.inDev;

  // await funcs.delay(3000);

  if (gameState.currentMap != "nasa") {
    eventBus.dispatchEvent(new CustomEvent("to_nasa", { detail: sequence }));
    return;
  }

  gameState.smallEngine = true;
  tasksStore.showMinigame = true;

  loading.isLoading = false;

  if (!runDialog) return;

  assistant.say(
    "Dovrai programmare un satellite e fargli gestire al meglio degli eventi",
    {
      duration: 4000,
      icon: "normal",
    }
  );

  await funcs.delay(4000);

  assistant.say(
    "Avrai MOOLTI più blocchi a disposizione, dei quali molti non ti serviranno",
    {
      duration: 6000,
      icon: "normal",
    }
  );
  await funcs.delay(6000);

  assistant.say(
    "<i>psst</i> anche uno dei 4 blochi di partenza non ti servirà",
    {
      duration: 5000,
      icon: "normal",
    }
  );

  await funcs.delay(4000);

  assistant.say(
    "Leggi attentamente le istruzioni e concentrati su una cosa alla volta",
    {
      duration: 6000,
      icon: "normal",
    }
  );

  await funcs.delay(6000);

  assistant.say("Non sarà molto complicato alla fine, confido in te ;)", {
    duration: 6000,
    icon: "normal",
  });
}
export default async (cGame: Engine) => {
  game = cGame;
  sequence();
};
