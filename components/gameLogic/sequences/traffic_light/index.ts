import type Engine from "../../Engine";
import { Observer, Scene, Vector3, type FreeCamera } from "babylonjs";
import funcs from "~/utils/generalFuncs";
import assistant from "~/utils/assistant";

export default async (game: Engine) => {
  const tasksStore = useTasksStore();
  const gameState = useGameStateStore();

  if (gameState.dialogs.traffic_light.intro) return;
  gameState.dialogs.traffic_light.intro = true;

  await funcs.delay(500);

  assistant.say(
    "Qui anche le cose che meno ti aspetti hanno qualche sistema per segnalare il malfunzionamento",
    {
      duration: 5000,
    }
  );

  // await funcs.delay(3000);

  // assistant.say("Vai nella direzione della freccia e ripara quel semaforo!", {
  //   duration: 4000,
  // });
};
