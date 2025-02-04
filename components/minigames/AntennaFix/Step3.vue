<script lang="ts" setup>
import { Check, X } from "lucide-vue-next";
import JSConfetti from "js-confetti";
import assistant from "~/utils/assistant";
import { eventBus } from "~/event-bus";

const gameState = useGameStateStore();
const tasksStore = useTasksStore();
const sharedData = useSharedData();

const total_xp = ref(0);

if (gameState.minigames.antenna_fix.ideal_frequency.status)
  total_xp.value += gameState.minigames.antenna_fix.ideal_frequency.reward;
if (gameState.minigames.antenna_fix.normalized_signal.status)
  total_xp.value += gameState.minigames.antenna_fix.normalized_signal.reward;

gameState.xp += total_xp.value;

onMounted(() => {
  const jsConfetti = new JSConfetti();

  jsConfetti.addConfetti({
    emojis: ["🎉", "⚡️", "💥", "✨", "💫"],
  });
});

onBeforeUnmount(() => {
  tasksStore.clearTasks();

  if (sharedData.runAllScenes)
    setTimeout(() => {
      eventBus.dispatchEvent(
        new CustomEvent("runScene", {
          detail: "fixed_antenna",
        } as CustomEventInit)
      );
    }, 3000);
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
              <TableCell class="font-medium"> Frequenza ideale </TableCell>
              <TableCell
                ><Tooltip
                  v-if="gameState.minigames.antenna_fix.ideal_frequency.status"
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
                  gameState.minigames.antenna_fix.ideal_frequency
                    ? gameState.minigames.antenna_fix.ideal_frequency.reward
                    : 0
                }}</TableCell
              >
            </TableRow>
            <TableRow>
              <TableCell class="font-medium"
                >Normalizzazione del segnale</TableCell
              >
              <TableCell
                ><Tooltip
                  v-if="
                    gameState.minigames.antenna_fix.normalized_signal.status
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
                  gameState.minigames.antenna_fix.normalized_signal.status
                    ? gameState.minigames.antenna_fix.normalized_signal.reward
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
