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

  await funcs.delay(5000);

  generalData.activeControls = false;
  generalData.cameraFollow = false;

  const targetPosition = new Vector3(19.754, 5.156, 8.638);
  const targetRotation = new Vector3(
    funcs.degToRad(-15.02),
    funcs.degToRad(44.75),
    0
  );

  await funcs.moveCamera({
    camera,
    game,
    targetPosition,
    targetRotation,
    speed: 0.01,
  });

  assistant.say("Questa è l'antenna che controlla i droni fattorini", {
    duration: 5000,
    icon: "normal",
  });

  const drone = await utilsMeshes.drone.spawn();

  drone.position = new Vector3(51.36, 16.33, -3.88);
  drone.rotation = new Vector3(funcs.degToRad(5.73), funcs.degToRad(-12.69), 0);

  const targetDronePosition = new Vector3(19.49, 7.49, 75.81);

  funcs
    .moveCamera({
      //@ts-ignore
      camera: drone,
      game,
      targetPosition: targetDronePosition,
      targetRotation: drone.rotation,
      speed: 0.01,
    })
    .then(() => {
      drone.dispose();
    });

  await funcs.delay(2000);

  assistant.say("Serve a tracciare tutta la rete dei droni...", {
    duration: 5000,
    icon: "normal",
  });

  await funcs.delay(4000);

  tasksStore.setTaskTracker("broken_antenna");

  assistant.say("...eeee si è rotta", {
    duration: 3000,
    icon: "normal",
  });
};
