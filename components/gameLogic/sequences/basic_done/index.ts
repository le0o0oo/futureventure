import type Engine from "../../Engine";
import { Observer, Scene, Vector3, type FreeCamera } from "babylonjs";
import funcs from "~/utils/generalFuncs";
import assistant from "~/utils/assistant";

export default async (game: Engine) => {
  const tasksStore = useTasksStore();
  const gameState = useGameStateStore();

  // await funcs.delay(3000);

  assistant.say("Bel lavoro!", {
    duration: 4000,
    icon: "happy",
  });

  await funcs.delay(2000);

  assistant.say(
    "Adesso che hai le basi di come funzionano le cose possiamo proseguire",
    {
      duration: 5000,
      icon: "happy",
    }
  );
};
