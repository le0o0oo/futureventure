<template>
  <div>
    <vue-video-player
      ref="player"
      src="/satellite_demo/demo_7.mp4"
      class="w-[974px] h-[407.86px]"
      :volume="0"
      :autoplay="true"
      :loop="true"
    ></vue-video-player>
    <Separator class="my-5" />

    <span class="text-lg"
      >Viene stabilita quindi una connessione e avviene lo scambio di dati.
    </span>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
