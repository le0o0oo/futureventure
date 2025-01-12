<script lang="ts" setup>
import { Check, X } from "lucide-vue-next";
import JSConfetti from "js-confetti";
import assistant from "~/utils/assistant";
import { eventBus } from "~/event-bus";

const gameState = useGameStateStore();
const tasksStore = useTasksStore();
const sharedData = useSharedData();

const total_xp = ref(0);

if (gameState.minigames.cables_fix.first_try)
  total_xp.value += gameState.minigames.cables_fix.first_try.reward;
if (gameState.minigames.cables_fix.completion.status)
  total_xp.value += gameState.minigames.cables_fix.completion.reward;

gameState.xp += total_xp.value;

onMounted(() => {
  const jsConfetti = new JSConfetti();

  jsConfetti.addConfetti({
    emojis: ["🎉", "⚡️", "💥", "✨", "💫"],
  });
});

onBeforeUnmount(() => {
  tasksStore.clearTasks();
  gameState.progress++;

  if (sharedData.runAllScenes)
    setTimeout(() => {
      eventBus.dispatchEvent(
        new CustomEvent("runScene", {
          detail: "basic_done",
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
              <TableCell class="font-medium">
                Successo al primo tentativo
              </TableCell>
              <TableCell
                ><Tooltip
                  v-if="gameState.minigames.cables_fix.first_try.status"
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
                  gameState.minigames.cables_fix.first_try.status
                    ? gameState.minigames.cables_fix.first_try.reward
                    : 0
                }}</TableCell
              >
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Completamento</TableCell>
              <TableCell
                ><Tooltip
                  v-if="gameState.minigames.cables_fix.completion.status"
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
                  gameState.minigames.cables_fix.completion.status
                    ? gameState.minigames.cables_fix.completion.reward
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

    <Separator class="my-10" />
    <div class="w-full flex justify-center">
      <Button class="w-[200px]" @click="$emit('close')">Chiudi</Button>
    </div>
  </div>
</template>

<style></style>
