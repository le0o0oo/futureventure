<script lang="ts" setup>
import { cn } from "@/lib/utils";

const isDev = ref(import.meta.dev);
const config = useRuntimeConfig();
</script>

<template>
  <div
    class="w-screen"
    :class="cn(isDev ? 'h-[calc(100vh-51.99px)]' : 'h-screen')"
  >
    <DevToolsNav v-if="config.public.inDev" />

    <slot />
  </div>
</template>

<style></style>
