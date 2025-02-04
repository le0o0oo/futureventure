<script setup lang="ts">
import Visualizer from "./Visualizer.vue";
import funcs from "~/utils/generalFuncs";
import { watchDebounced } from "@vueuse/core";
import { cn } from "~/lib/utils";

const maxVal = funcs.randomInt(100, 300);
const minVal = funcs.randomInt(0, 100);
const diffVal = ref<number[]>([funcs.randomInt(minVal, maxVal)]);

const didNext = ref(false);
const diffOffset = 5;

const emit = defineEmits(["next"]);
const gameState = useGameStateStore();

function next() {
  gameState.minigames.antenna_fix.normalized_signal.status = true;

  emit("next");
}

watchDebounced(
  diffVal,
  () => {
    if (
      (diffVal.value[0]! > 100 + diffOffset ||
        diffVal.value[0]! < 100 - diffOffset) &&
      !didNext.value
    )
      return;

    didNext.value = true;
    next();
  },
  { debounce: 500, maxWait: 1000 }
);
</script>

<template>
  <div class="size-full">
    <h1 class="font-bold text-center text-3xl">Calibra l'antenna</h1>
    <p class="text-center text-sm text-gray-500">
      Muovi la barra in modo da cercare di avere una linea orizzontale continua
    </p>

    <Separator class="my-5" />

    <Visualizer :diff="diffVal[0]!" />
    <Separator class="my-5" />
    <Slider
      v-model="diffVal"
      :min="minVal"
      :max="maxVal"
      :step="1"
      :disabled="didNext"
      :class="cn(didNext && 'opacity-50')"
    />
  </div>
</template>
