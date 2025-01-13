<template>
  <div>
    <vue-video-player
      ref="player"
      src="/satellite_demo/demo_4.mp4"
      class="w-[974px] h-[407.86px]"
      :volume="0"
      :autoplay="true"
      :loop="true"
    ></vue-video-player>
    <Separator class="my-5" />

    <span class="text-lg"
      >Dalla Terra, la stazione di osservazione punterà un raggio laser alla
      posizione cacolata come un faro, utilizzato per intercettare il satellite
      al suo passaggio.
    </span>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
