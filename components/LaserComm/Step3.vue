<script lang="ts" setup></script>

<template>
  <div>
    <div class="w-full grid grid-cols-2 gap-2">
      <div>
        <vue-video-player
          ref="player"
          src="/satellite_demo/demo_1.mp4"
          class="w-[483px] h-[202px]"
          :volume="0"
          :autoplay="true"
          :loop="true"
        ></vue-video-player>
      </div>
      <div>
        <vue-video-player
          ref="player"
          src="/satellite_demo/demo_1_1.mp4"
          class="w-[483px] h-[202px]"
          :volume="0"
          :autoplay="true"
          :loop="true"
        ></vue-video-player>
      </div>
    </div>

    <Separator class="my-5" />

    <span class="text-lg">
      Un satellitle orbita la Terra, mentre sulla Terra è presente una stazione
      di osservazione ottica, entrambi equipaggati con l'hardware necessario per
      la comunicazione
    </span>
  </div>
</template>

<style>
*:focus {
  outline: none;
}
</style>
