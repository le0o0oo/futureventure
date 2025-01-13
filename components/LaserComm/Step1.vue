<script lang="ts" setup>
import { Info, ExternalLink } from "lucide-vue-next";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
</script>

<template>
  <div class="size-full flex flex-col">
    <img
      src="https://www.nasa.gov/wp-content/uploads/2021/07/lcrd_1.jpg"
      class="h-[300px] rounded-xl w-full object-cover object-[95%]"
    />
    <Separator class="my-5" />
    <span class="text-lg"
      >Man mano che gli strumenti scientifici si evolvono per acquisire dati ad
      alta definizione come i video 4K, la trasmissione via onde radio diventa
      sempre più inefficente. <br />
      La comunicazione via laser è una soluzione innovativa che permette di
      accelerare il processo di trasferimento dati da
      <strong>10</strong> a <strong>100</strong> volte
    </span>

    <Separator class="my-3" />

    <NuxtLink
      :external="true"
      target="_blank"
      :class="
        cn(
          buttonVariants({
            variant: 'secondary',
          })
        )
      "
      to="https://www.nasa.gov/technology/laser-communications-empowering-more-data-than-ever-before/"
      >Fonte <ExternalLink
    /></NuxtLink>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
