<template>
  <div>
    <vue-video-player
      ref="player"
      src="/satellite_demo/demo_2.mp4"
      class="w-[974px] h-[407.86px]"
      :volume="0"
      :autoplay="true"
      :loop="true"
    ></vue-video-player>

    <Separator class="my-5" />

    <span class="text-lg"
      >Per trovarsi con alta accuratezza, la stazione di osservazione deve
      sapere dove guardare, mentre il satellite deve mantenere la sua posizione
      e orientazione relativa alla terra
    </span>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
