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

  const camera = game.getCamera() as FreeCamera;

  // await funcs.delay(3000);

  if (gameState.currentMap != "nasa") {
    eventBus.dispatchEvent(new CustomEvent("to_nasa", { detail: sequence }));
    return;
  }

  gameState.smallEngine = true;
  tasksStore.showMinigame = true;
}
export default async (cGame: Engine) => {
  game = cGame;
  sequence();
};
