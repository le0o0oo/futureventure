<script lang="ts" setup>
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

function colourRandom() {
  var num = Math.floor(Math.random() * Math.pow(2, 24));
  return "#" + ("00000" + num.toString(16)).substr(-6);
}

const disable = ref(false);
const color = ref("");
const gameState = useGameStateStore();

onMounted(() => {
  color.value = colourRandom();
});

function handleClick() {
  disable.value = !disable.value;
  gameState.minigames.cables_fix.first_try.status = false;

  toast.error("Cavo sbagliato!", {
    position: "top-right",
  });
}
</script>
<template>
  <button
    :class="
      cn(
        'w-full outline-secondary border-2 border-transparent  p-2 transition-colors rounded-md',
        props.class,
        disable && 'opacity-70',
        !disable && 'hover:border-border cursor-pointer'
      )
    "
    :disabled="disable"
    @click="handleClick"
  >
    <div class="flex items-center w-full">
      <div
        class="h-[30px] w-[15px] bg-gradient-to-l from-neutral-400 to-background border-black border-2 border-l-0"
      ></div>
      <div
        class="w-full h-[20px] flex justify-center"
        :style="{ backgroundColor: color }"
      >
        <div
          class="w-[calc(100%-20px)] bg-white h-[5px] relative top-1 rounded-full"
          style="filter: blur(0.2rem)"
        ></div>
      </div>
      <div
        class="h-[30px] w-[15px] bg-gradient-to-r from-neutral-400 to-background border-black border-2 border-r-0"
      ></div>
    </div>
  </button>
</template>

<style></style>
