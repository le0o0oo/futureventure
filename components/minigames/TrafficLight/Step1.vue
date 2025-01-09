<script lang="ts" setup>
import { cn } from "@/lib/utils";
import { ArrowRight, CircleAlert } from "lucide-vue-next";

let microcontrollers = [
  {
    name: "Arduino nano",
    image: "/traffic_light/arduino_nano.webp",
  },
  {
    name: "Microchip® PIC16F877A",
    image: "/traffic_light/PIC16F877A.png",
  },
  {
    name: "Microchip® PIC18F4520",
    image: "/traffic_light/PIC18F4520.png",
  },
  {
    name: "STMicroelectronics® STM32F103RCT6",
    image: "/traffic_light/STM32F103RCT6.webp",
  },
  {
    name: "Texas Instruments® TM4C123GH6PM",
    image: "/traffic_light/TM4C123GH6PM.png",
  },
  {
    name: "NXP LPC1768",
    image: "/traffic_light/LPC1768.webp",
  },
];
function shuffleArray(array: Array<any>) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
shuffleArray(microcontrollers);

const brokenComponent = Math.floor(Math.random() * microcontrollers.length);

const selectedComponentIndex = ref(-1);
const showWrongComponent = ref(false);
const emit = defineEmits(["next"]);
const gameState = useGameStateStore();

const startDrag = (event: DragEvent, item: number) => {
  event.dataTransfer!.dropEffect = "copy";

  event.dataTransfer?.setData("micro_index", String(item));
};

const onDrop = (event: DragEvent) => {
  event.preventDefault();
  const data = event.dataTransfer?.getData("micro_index");
  selectedComponentIndex.value = Number(data);
  showWrongComponent.value = false;
};

function next() {
  if (selectedComponentIndex.value === brokenComponent) {
    gameState.minigames.traffic_light.fixed_microprocessor.status = true;
    emit("next");
    showWrongComponent.value = false;
  } else {
    showWrongComponent.value = true;
  }
}
</script>

<template v-else-if="cStep === 1">
  <span class="font-bold text-lg text-left"
    >Sostituire il microcontrollore danneggiato con un modello identico presente
    nella lista a destra.</span
  >
  <Separator class="my-2" />
  <div class="grid grid-cols-4 size-full">
    <div class="size-full flex flex-col items-center justify-center">
      <div class="flex justify-end w-full">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div class="p-3 bg-red-800 rounded-full">
                <CircleAlert /></div
            ></TooltipTrigger>
            <TooltipContent>
              <p>Componente malfunzionante</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <img :src="microcontrollers[brokenComponent]?.image" class="w-[290px]" />
      <span
        class="mt-5 font-bold text-lg"
        v-text="microcontrollers[brokenComponent]?.name"
      ></span>
    </div>
    <div class="flex justify-center items-center">
      <ArrowRight class="size-[5rem]" />
    </div>
    <div class="p-3 flex flex-col gap-1 justify-center">
      <span class="font-bold text-left">Componente da sostituire</span>
      <AspectRatio :ratio="1">
        <div
          class="rounded-md border-secondary border-2 size-full flex justify-center items-center p-2"
          :class="cn(selectedComponentIndex == -1 && 'border-dotted')"
          @drop="onDrop($event)"
          @dragenter.prevent
          @dragover.prevent
        >
          <span v-if="selectedComponentIndex == -1">Trascina qui</span>
          <img
            :src="microcontrollers[selectedComponentIndex]!.image"
            v-else
          /></div
      ></AspectRatio>
      <div class="bg-secondary/70 mt-3 rounded-md">
        <span
          v-if="selectedComponentIndex != -1"
          v-text="microcontrollers[selectedComponentIndex]!.name"
          class="px-2"
        ></span>
      </div>
    </div>
    <div>
      <span class="font-bold text-lg">Seleziona microcontrollore</span>
      <div
        class="size-full overflow-y-scroll max-h-[calc(80vh-240px)] flex flex-col gap-3"
      >
        <button
          class="rounded-xl border-2 p-2 transition-colors hover:border-secondary-foreground"
          v-for="(i, index) in microcontrollers"
          :key="i.name"
        >
          <img
            :src="i.image"
            class="w-[290px] cursor-move"
            draggable="true"
            @dragstart="startDrag($event, index)"
          />
          <div class="bg-secondary/70 mt-3 rounded-md">
            <span v-text="i.name"></span>
          </div>
        </button>
      </div>

      <div
        class="mt-2 flex gap-2 items-center justify-end w-full"
        v-auto-animate
      >
        <span class="text-red-600" v-if="showWrongComponent"
          >Componente sbagliato!</span
        >
        <Button @click="next()">Prossimo <ArrowRight /></Button>
      </div>
    </div>
  </div>
</template>

<style></style>
