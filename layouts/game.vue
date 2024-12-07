<script lang="ts" setup>
import { cn } from "@/lib/utils";

const isDev = ref(import.meta.dev);
</script>

<template>
  <div
    class="w-screen"
    :class="cn(isDev ? 'h-[calc(100vh-51.99px)]' : 'h-screen')"
  >
    <DevOnly>
      <DevToolsNav />
    </DevOnly>
    <slot />
  </div>
</template>

<style></style>
