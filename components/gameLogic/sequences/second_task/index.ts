import type Engine from "../../Engine";
import { Observer, Scene, Vector3, type FreeCamera } from "babylonjs";
import funcs from "~/utils/generalFuncs";
import assistant from "~/utils/assistant";

export default async (game: Engine) => {
  const tasksStore = useTasksStore();
  const gameState = useGameStateStore();

  gameState.progress = 1;

  tasksStore.setTaskTracker("cables_fix");

  // await funcs.delay(2500);

  // assistant.say("Congratulazioni", {
  //   duration: 4000,
  // });
};
