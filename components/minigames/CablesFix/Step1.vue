<script setup lang="ts">
import Resistor from "./comps/Resistor.vue";
import { toast } from "vue-sonner";
const emit = defineEmits(["pass"]);

function getRandomIntegerInRange(min: number, max: number) {
  if (min > max) {
    throw new Error("Min should not be greater than Max");
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const resistorIndex = ref(0);
const gameState = useGameStateStore();

onMounted(() => {
  resistorIndex.value = getRandomIntegerInRange(1, 4);
});

const targetR = ref(getRandomIntegerInRange(1, 100));
const currentR = ref(getRandomIntegerInRange(1, 100));

const rightResistorIndex = ref(getRandomIntegerInRange(1, 4));

function nopass() {
  toast.error("Resistenza sbagliata!", { position: "top-right" });
  gameState.minigames.cables_fix.first_try.status = false;
}

function pass() {
  gameState.minigames.cables_fix.completion.status = true;
  emit("pass");
}
</script>

<template>
  <span class="font-bold"
    >Sostituisci la resistenza con una che corrisponda ai valori finali</span
  >
  <Separator class="w-full my-2" />
  <div class="grid grid-cols-2 gap-3">
    <div>
      <span class="font-bold text-lg">Valori attuali</span>
      <pre>
Rtot = {{ currentR }}Ω
    </pre
      >
    </div>

    <div>
      <span class="font-bold text-lg">Valori finali</span>
      <pre class="text-red-600">
Rtot = {{ targetR }}Ω
    </pre
      >
    </div>
  </div>
  <div class="size-full h-[calc(100%-400px)] flex items-center justify-center">
    <div class="grid grid-cols-4 w-full h-[298px]">
      <div v-for="i in 4" class="h-full">
        <AspectRatio :ratio="2" class="">
          <div v-if="i != resistorIndex" class="flex items-center">
            <div class="bg-white h-[19px] w-full mt-[60px]"></div>
          </div>

          <template v-else>
            <Resistor />
            <span
              class="bg-neutral-700 w-full p-1 rounded-md text-center font-bold"
              >R = {{ currentR }}Ω</span
            >
          </template>
        </AspectRatio>
      </div>
    </div>
  </div>

  <div
    class="w-full border-border border-t-2 rounded-md p-3 h-[calc(100%-480px)] grid grid-cols-4 gap-3"
  >
    <button
      v-for="i in 4"
      class="w-full h-[215px] flex items-center flex-col justify-center border-2 border-transparent hover:border-secondary-foreground p-1 rounded-md transition-colors"
      @click="i == rightResistorIndex ? pass() : nopass()"
    >
      <AspectRatio :ratio="2">
        <Resistor />
      </AspectRatio>
      <span class="bg-neutral-700 w-full p-1 rounded-md text-center font-bold"
        >R =
        {{
          i == rightResistorIndex ? targetR : getRandomIntegerInRange(1, 100)
        }}Ω</span
      >
    </button>
  </div>
</template>
