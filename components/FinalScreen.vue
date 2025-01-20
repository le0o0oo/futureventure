<script lang="ts" setup>
import JSConfetti from "js-confetti";

const gameState = useGameStateStore();
const finalTaskStore = useFinalTaskStore();

const finalData = gameState.minigames.satellite_fix;

const total_xp = ref(0);

if (finalData.data_transfer.status)
  total_xp.value += finalData.data_transfer.reward;
if (finalData.point_earth.status)
  total_xp.value += finalData.point_earth.reward;
if (finalData.solarstorm_handle.status)
  total_xp.value += finalData.solarstorm_handle.reward;
if (finalData.every.status) total_xp.value += finalData.every.reward;

gameState.xp += total_xp.value;

onMounted(() => {
  const jsConfetti = new JSConfetti();

  jsConfetti.addConfetti({
    emojis: ["🎉", "⚡️", "💥", "✨", "💫"],
  });
});
</script>

<template>
  <div class="size-full">
    <h1 class="font-extrabold text-5xl pt-4 text-center">
      Congratulazioni! 🎉
    </h1>
    <h2 class="text-2xl pt-4 text-center">
      Grazie per aver provato la nostra esperienza
    </h2>

    <Separator class="my-5" />

    <TooltipProvider>
      <div class="w-full flex items-center justify-center">
        <div class="lg:max-w-[70vw] w-full">
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
                <TableCell class="font-medium"> Puntando all Terra </TableCell>
                <TableCell
                  ><Tooltip v-if="finalData.point_earth.status">
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
                    finalData.point_earth.status
                      ? finalData.point_earth.reward
                      : 0
                  }}</TableCell
                >
              </TableRow>
              <TableRow>
                <TableCell class="font-medium"
                  >Gestione tasferimento dati</TableCell
                >
                <TableCell
                  ><Tooltip v-if="finalData.data_transfer.status">
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
                    finalData.data_transfer.status
                      ? finalData.data_transfer.reward
                      : 0
                  }}</TableCell
                >
              </TableRow>
              <TableRow>
                <TableCell class="font-medium"
                  >Gestione tempeste solari</TableCell
                >
                <TableCell
                  ><Tooltip v-if="finalData.solarstorm_handle.status">
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
                    finalData.solarstorm_handle.status
                      ? finalData.solarstorm_handle.reward
                      : 0
                  }}</TableCell
                >
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>

    <div class="w-full flex justify-center mt-5">
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
</template>

<style></style>
