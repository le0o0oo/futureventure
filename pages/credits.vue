<script lang="ts" setup>
import { ExternalLink } from "lucide-vue-next";
import { Icon } from "@iconify/vue";
import { buttonVariants } from "~/components/ui/button";

let credits: { title: string; description?: string; link?: string }[] = [
  {
    title: "Babylon.js",
    description: "L'engine 3D che ha reso possibile questo progetto",
    link: "https://www.babylonjs.com/",
  },
  {
    title: "PIXI.js",
    description: "Engine 2D usato per il minigioco del satellite",
    link: "https://pixijs.com/",
  },
  {
    title: "Blockly",
    description: "Libreria per la programmazione a blocchi",
    link: "https://developers.google.com/blockly",
  },
  {
    title: "TNO",
    description:
      "I dati riguardanti la comunicazione laser e i sistemi descritti nel progetto",
    link: "https://www.tno.nl",
  },
  {
    title: "NASA",
    description: "Alcuni dati riguardanti la comunicazione laser",
    link: "https://www.nasa.gov/communicating-with-missions/lasercomms/",
  },
  {
    title: "Nuxt (e quindi Vue.js)",
    description: "Framework web su cui è costruito il tutto",
    link: "https://nuxt.com/",
  },
  {
    title: "Musica satellite: Forest Bathing (by Rainman)",
    description: "Musica usata durante la parte dei satelliti",
    link: "https://youtu.be/AtAsljAwqkQ?si=2ZHivvsbb9Z8znZ9",
  },
  {
    title: "Musica principale: Fatta con IA",
    description: "Musica usata durante la prima parte",
  },
  {
    title: "Suoni notifica: KDE Plasma Ocean",
    description: "Suoni di notifica, completion-success e completion-partial",
    link: "https://invent.kde.org/plasma/ocean-sound-theme/-/tree/master/ocean/stereo?ref_type=heads",
  },
  {
    title: "Suoni notifica assistente: RasoolAsaad",
    description: "Suono di notifica dell'assistente",
    link: "https://pixabay.com/sound-effects/notification-alert-269289/",
  },
  {
    title: "Skybox spazio",
    description: "Tool usato per generare la skybox",
    link: "https://tools.wwwtyro.net/space-3d/index.html#animationSpeed=1&fov=80&nebulae=true&pointStars=true&resolution=1024&seed=7fyce71d8sk0&stars=true&sun=true",
  },
  {
    title: "Icona",
    description: "Icona del progetto (e modificata)",
    link: "https://blog.designcrowd.fr/article/1937/88-gamer-logos-for-the-avid-players",
  },
];

const members = [
  {
    image: "https://avatars.githubusercontent.com/u/50551069?v=4",
    name: "Leo",
    roles: [
      "Programmazione",
      "UI Design",
      "Game design",
      "Lore",
      "Modelli 3D",
      "Audio",
    ],
    socials: [
      {
        icon: "mdi:github",
        link: "https://github.com/le0o0oo",
      },
      {
        icon: "mdi:instagram",
        link: "https://www.instagram.com/lea0o0oo",
      },
    ],
  },
  {
    image: "/members/bushcaa.jpg",
    name: "Buschix",
    roles: ["Lore", "Modelli 3D", "Video & doppiaggio"],
    socials: [
      {
        icon: "mdi:instagram",
        link: "https://www.instagram.com/bushcaa_/",
      },
    ],
  },
  {
    name: "Catins",
    roles: ["Modelli 3D", "Mappa"],
    socials: [
      {
        icon: "mdi:instagram",
        link: "https://www.instagram.com/catino.mattia",
      },
    ],
  },
  {
    image: "/members/guti.jpg",
    name: "Guti",
    roles: ["Lore", "Audio"],
    socials: [
      {
        icon: "mdi:instagram",
        link: "https://www.instagram.com/nick.gutii/",
      },
    ],
  },
];

credits = credits.sort((a, b) => a.title.localeCompare(b.title));
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
      <div class="relative pt-36 ml-auto p-3">
        <div class="lg:w-2/3 text-center mx-auto">
          <h1
            class="text-gray-900 text-balance dark:text-white font-bold text-5xl md:text-6xl xl:text-7xl"
          >
            Crediti
          </h1>
          <Separator class="my-8" />

          <div class="flex justify-center w-full">
            <div
              class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 w-full gap-3"
            >
              <Card
                class="text-left w-full"
                v-for="member in members"
                :key="member.name"
              >
                <CardHeader>
                  <CardTitle class="flex items-center gap-3"
                    ><img
                      v-if="member.image"
                      :src="member.image"
                      class="rounded-full size-7"
                    />{{ member.name }}</CardTitle
                  >
                </CardHeader>
                <CardContent class="h-[calc(100%-130px)]">
                  <div class="size-full flex flex-col gap-1">
                    <div
                      class="border-border border-[1px] rounded-xl p-2 transition-all hover:border-secondary-foreground hover:shadow-2xl"
                      v-for="role in member.roles"
                    >
                      {{ role }}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <NuxtLink
                    v-for="social in member.socials"
                    :external="true"
                    target="_blank"
                    :to="social.link"
                  >
                    <Icon :icon="social.icon" class="size-8" />
                  </NuxtLink>
                </CardFooter>
              </Card>
            </div>
          </div>

          <Separator class="my-8" />

          <h2>Questo progetto non sarebbe stato possibile senza i seguenti:</h2>
          <div class="mt-8">
            <Accordion type="single" class="w-full" collapsible>
              <AccordionItem
                v-for="(item, index) in credits"
                :key="index"
                :value="String(index)"
              >
                <AccordionTrigger
                  ><div class="flex items-center gap-3 text-xl">
                    {{ item.title }}
                    <NuxtLink
                      v-if="item.link"
                      :class="buttonVariants({ variant: 'outline' })"
                      :to="item.link"
                      :external="true"
                      target="_blank"
                      ><ExternalLink
                    /></NuxtLink></div
                ></AccordionTrigger>
                <AccordionContent class="text-left" v-if="item.description">
                  {{ item.description }}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </Container>
  </div>
</template>

<style></style>
