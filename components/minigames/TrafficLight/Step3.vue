<script lang="ts" setup>
import { Check, X } from "lucide-vue-next";
import JSConfetti from "js-confetti";
import assistant from "~/utils/assistant";

const gameState = useGameStateStore();
const tasksStore = useTasksStore();

const total_xp = ref(0);

if (gameState.minigames.traffic_light.fixed_microprocessor.status)
  total_xp.value +=
    gameState.minigames.traffic_light.fixed_microprocessor.reward;
if (gameState.minigames.traffic_light.implemented_updates.status)
  total_xp.value +=
    gameState.minigames.traffic_light.implemented_updates.reward;
if (gameState.minigames.traffic_light.fixed_code.status)
  total_xp.value += gameState.minigames.traffic_light.fixed_code.reward;

gameState.xp += total_xp.value;

onMounted(() => {
  const jsConfetti = new JSConfetti();

  jsConfetti.addConfetti({
    emojis: ["🎉", "⚡️", "💥", "✨", "💫"],
  });

  assistant.say("Congratulazioni, operatore!");
});

onBeforeUnmount(() => {
  tasksStore.clearTasks();
});
</script>

<template>
  <div class="size-full">
    <h1 class="text-center font-extrabold text-4xl mt-2">
      🎉 Congratulazioni!
    </h1>
    <Separator class="mt-3 w-full" />
    <div class="mt-5">
      <TooltipProvider>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead> Compito </TableHead>
              <TableHead>Completamento</TableHead>
              <TableHead>XP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell class="font-medium">
                Sostituzione microcontrollore difettoso
              </TableCell>
              <TableCell
                ><Tooltip
                  v-if="
                    gameState.minigames.traffic_light.fixed_microprocessor
                      .status
                  "
                >
                  <TooltipTrigger
                    ><Check class="text-green-700"
                  /></TooltipTrigger>
                  <TooltipContent>
                    <p>Completato</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip v-else>
                  <TooltipTrigger><X class="text-red-700" /></TooltipTrigger>
                  <TooltipContent>
                    <p>Non completato</p>
                  </TooltipContent>
                </Tooltip></TableCell
              >
              <TableCell class="font-bold text-lg"
                >+{{
                  gameState.minigames.traffic_light.fixed_microprocessor.status
                    ? gameState.minigames.traffic_light.fixed_microprocessor
                        .reward
                    : 0
                }}</TableCell
              >
            </TableRow>
            <TableRow>
              <TableCell class="font-medium"
                >Programmazione del microcontrollore</TableCell
              >
              <TableCell
                ><Tooltip
                  v-if="gameState.minigames.traffic_light.fixed_code.status"
                >
                  <TooltipTrigger
                    ><Check class="text-green-700"
                  /></TooltipTrigger>
                  <TooltipContent>
                    <p>Completato</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip v-else>
                  <TooltipTrigger><X class="text-red-700" /></TooltipTrigger>
                  <TooltipContent>
                    <p>Non completato</p>
                  </TooltipContent>
                </Tooltip></TableCell
              >
              <TableCell class="font-bold text-lg"
                >+{{
                  gameState.minigames.traffic_light.fixed_code.status
                    ? gameState.minigames.traffic_light.fixed_code.reward
                    : 0
                }}</TableCell
              >
            </TableRow>
            <TableRow>
              <TableCell class="font-medium"
                >Implementazione aggiornamenti automatici</TableCell
              >
              <TableCell
                ><Tooltip
                  v-if="
                    gameState.minigames.traffic_light.implemented_updates.status
                  "
                >
                  <TooltipTrigger
                    ><Check class="text-green-700"
                  /></TooltipTrigger>
                  <TooltipContent>
                    <p>Completato</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip v-else>
                  <TooltipTrigger><X class="text-red-700" /></TooltipTrigger>
                  <TooltipContent>
                    <p>Non completato</p>
                  </TooltipContent>
                </Tooltip></TableCell
              >
              <TableCell class="font-bold text-lg"
                >+{{
                  gameState.minigames.traffic_light.implemented_updates.status
                    ? gameState.minigames.traffic_light.implemented_updates
                        .reward
                    : 0
                }}</TableCell
              >
            </TableRow>
          </TableBody>
        </Table>
      </TooltipProvider>

      <Separator class="my-3" />

      <div class="w-full flex justify-center">
        <div class="grid grid-cols-2">
          <div class="border-secondary border-2 p-4">
            <h2 class="text-center font-bold text-2xl">
              XP guadagnata: +{{ total_xp }}
            </h2>
          </div>
          <div class="border-secondary border-2 p-4 border-l-0">
            <h2 class="text-center font-bold text-2xl">
              XP totale: {{ gameState.xp }}
            </h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
