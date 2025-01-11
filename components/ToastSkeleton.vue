<script lang="ts" setup>
import TellySVG_greet from "~/assets/TellySVG_greet.vue";
import TellySVG_normal from "~/assets/TellySVG_normal.vue";
import TellySVG_happy from "~/assets/TellySVG_happy.vue";

defineProps<{
  description: string;
  assistantState: "greet" | "normal" | "happy" | "none";
}>();
</script>

<template>
  <div class="border-border border-2 p-5 bg-background rounded-lg">
    <div class="flex items-center gap-3 w-full">
      <div class="w-full">
        <h3 class="font-bold text-xl">Telly</h3>
        <p v-html="description"></p>
      </div>

      <div>
        <TellySVG_greet class="size-[60px]" v-if="assistantState == 'greet'" />
        <TellySVG_normal
          class="size-[60px]"
          v-else-if="assistantState == 'normal'"
        />
        <TellySVG_happy
          class="size-[60px]"
          v-else-if="assistantState == 'happy'"
        />
      </div>
    </div>
  </div>
</template>

<style></style>
