<script setup lang="ts">
import "video.js/dist/video-js.css";

const loading = useLoadingStore();
</script>

<template>
  <div class="w-screen h-screen overflow-x-hidden">
    <Toaster position="top-left" />
    <NuxtLoadingIndicator
      color="linear-gradient(90deg, rgba(31,65,149,1) 0%, rgba(109,40,217,1) 91%)"
    />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>

  <transition name="fade-slow">
    <div
      v-if="loading.isLoading"
      class="absolute inset-0 z-50 flex flex-col items-center justify-center w-full h-full gap-10 bg-background"
    >
      <!-- <p class="text-3xl font-bold animate-pulse">Caricamento</p> -->
      <img class="animate-pulse size-60" src="/icon.png" />
      <!-- <div
        class="flex items-center justify-center w-full"
        v-if="loading.progress.show"
      >
        <Progress
          :model-value="loading.progress.value"
          :max="loading.progress.max"
          class="max-w-[200px] h-[10px]"
        />
      </div> -->
    </div></transition
  >
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
