<script lang="ts" setup>
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  variant?: "primary" | "secondary";
  class?: HTMLAttributes["class"];
  disabled?: boolean;
}>();
</script>
<template>
  <button
    v-if="variant === 'primary' || !variant"
    :class="
    cn(
      'relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-indigo-600 before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max',
      props.class,
      props.disabled ? 'opacity-50  pointer-events-none' : ''
    )
    "
    :disabled="props.disabled"
  >
    <span
      class="relative text-base font-semibold text-white flex items-center gap-2"
    ><slot
    /></span>
  </button>
  <button
    v-else
    :class="
    cn(
      'relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-gray-800 sm:w-max',
      props.class
    )
    "
  >
    <span
      class="relative text-base font-semibold text-primary dark:text-white flex items-center gap-2"
    ><slot
    /></span>
  </button>
</template>

<style></style>
