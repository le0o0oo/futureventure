<script lang="ts" setup>
import { Info } from "lucide-vue-next";

const emit = defineEmits(["done"]);
const gameState = useGameStateStore();

function next(selected?: string) {
  if (selected === "868")
    gameState.minigames.antenna_fix.ideal_frequency.status = true;

  emit("done");
}
</script>

<template>
  <div class="size-full">
    <h1 class="font-bold text-center text-3xl">Seleziona frequenza ideale</h1>

    <Separator class="my-5" />

    <Alert class="border-blue-500">
      <Info class="h-4 w-4 stroke-blue-500" />
      <AlertTitle>Pro tip</AlertTitle>
      <AlertDescription>
        Frequenze minori hanno una portata maggiore e migliore penetrazione del
        segnale
      </AlertDescription>
    </Alert>

    <Separator class="my-5" />

    <div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
      <Button variant="outline" size="lg" @click="next()">2,4 GHz</Button>
      <Button variant="outline" size="lg" @click="next()">5,8 GHz</Button>
      <Button variant="outline" size="lg" @click="next('868')">868 MHz</Button>
    </div>
  </div>
</template>

<style></style>
