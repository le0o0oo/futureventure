<template>
  <div>
    <vue-video-player
      ref="player"
      src="/satellite_demo/demo_3.mp4"
      class="w-[974px] h-[407.86px]"
      :volume="0"
      :autoplay="true"
      :loop="true"
    ></vue-video-player>
    <Separator class="my-5" />

    <span class="text-lg"
      >Il satellitle invia i dati della sua posizione delle ultime 12 ore via
      <strong>radio</strong>.<br />Successivamente algoritmi sulla terra
      calcoleranno la traiettoria futura di quando passerà sopra la stazione di
      osservazione. <br />
      Il satellite sarà visible per 10 minuti
    </span>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
