import type Engine from "../../Engine";
import { Observer, Scene, Vector3, type FreeCamera } from "babylonjs";
import funcs from "~/utils/generalFuncs";
import assistant from "~/utils/assistant";
import utilsMeshes from "~/utils/utilsMeshes";

export default async (game: Engine) => {
  const tasksStore = useTasksStore();
  const gameState = useGameStateStore();
  const generalData = useGeneralStore();
  const camera = game.getCamera() as FreeCamera;

  // await funcs.delay(3000);

  tasksStore.clearTasks();

  await funcs.delay(3000);

  assistant.say(
    "Per andare su o giù usa rispettivamente il tasto <strong>Spazio</strong> e <strong>Shift</strong>",
    {
      duration: 4000,
      icon: "normal",
    }
  );
};
