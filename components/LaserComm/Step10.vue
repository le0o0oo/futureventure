<template>
  <div>
    <vue-video-player
      ref="player"
      src="/satellite_demo/demo_8.mp4"
      class="w-[974px] h-[407.86px]"
      :volume="0"
      :autoplay="true"
      :loop="true"
    ></vue-video-player>
    <Separator class="my-5" />

    <span class="text-lg"
      >I vantaggi di questa tecnologia sono tantissimi, tra cui:
      <ul class="list-disc pl-8">
        <li>Accesso a internet <strong>veloce</strong> in aree remote</li>
        <li>
          Sviluppare una crittografia sicura dal punto di vista quantistico in
          tutte le parti del mondo
        </li>
        <li>Creazione di veicoli autonomi con connessioni più sicure</li>
      </ul>
    </span>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
