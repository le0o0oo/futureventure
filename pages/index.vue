<script lang="ts" setup>
import { Gamepad2, NotepadText, Github } from "lucide-vue-next";

function isMobileDevice() {
  //@ts-ignore
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Check for mobile device identifiers in the user agent string
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    userAgent
  );
}

const disableBtn = ref(isMobileDevice());
</script>

<template>
  <div class="relative overflow-x-hidden">
    <div
      aria-hidden="true"
      class="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
    >
      <div
        class="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"
      ></div>
      <div
        class="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"
      ></div>
    </div>
    <Container>
      <div class="relative pt-36 ml-auto">
        <div class="lg:w-2/3 text-center mx-auto">
          <h1
            class="text-gray-900 text-balance dark:text-white font-bold text-5xl md:text-6xl xl:text-7xl"
          >
            Tuffati nel
            <span
              class="text-transparent bg-clip-text bg-gradient-to-tr from-blue-700 to-purple-400"
              >futuro.</span
            >
          </h1>
          <div class="mt-8">
            <ClientOnly>
              <vue-video-player
                src="https://dl.dropboxusercontent.com/scl/fi/vi61ntk7y0n765ntxsi5c/Video_FutureVenture.mp4?rlkey=l5o1uaoui6b2etjiwh2uyttk1&st=tp6aldlu&dl=0"
                class="max-w-[740px] h-[402px] size-full rounded-xl"
                :controls="true"
                poster="/thumbnail.png"
              ></vue-video-player>
            </ClientOnly>
          </div>
          <div class="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6 p-2">
            <NuxtLink to="/game"
              ><CoolBtn :disabled="disableBtn"
                ><Gamepad2 />Gioca ora</CoolBtn
              ></NuxtLink
            >
            <NuxtLink
              to="https://github.com/lea0o0oo/futureventure"
              :external="true"
              target="_blank"
              ><CoolBtn variant="secondary"
                ><Github />Codice sorgente</CoolBtn
              ></NuxtLink
            >
            <NuxtLink to="/credits">
              <CoolBtn variant="secondary"><NotepadText />Crediti</CoolBtn>
            </NuxtLink>
          </div>
          <span class="text-center text-sm" v-if="disableBtn"
            >Ci dispiace, ma il gioco non è compatibile con il tuo
            dispositivo.</span
          >
        </div>
      </div>
    </Container>
  </div>
</template>

<style></style>
