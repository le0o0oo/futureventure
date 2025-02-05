<script lang="ts" setup>
import { Menu } from "lucide-vue-next";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

const open = ref(false);
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent side="left">
      <SheetHeader>
        <SheetTitle></SheetTitle>
        <SheetDescription class="pt-10 flex flex-col gap-3">
          <NuxtLink
            :class="cn(buttonVariants({ variant: 'default' }), 'w-full')"
            @click="open = false"
            to="/"
            >Home</NuxtLink
          >
          <NuxtLink
            :class="cn(buttonVariants({ variant: 'default' }), 'w-full')"
            @click="open = false"
            to="/credits"
            >Crediti</NuxtLink
          >
        </SheetDescription>
      </SheetHeader>
    </SheetContent>

    <div class="fixed w-full top-0 left-0 p-4 z-50">
      <div
        class="px-1 flex items-center rounded-2xl backdrop-blur-2xl bg-white/30"
      >
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center">
            <img src="/icon.png" class="h-20" />
            <h3 class="font-bold text-3xl">FutureVenture</h3></NuxtLink
          >
        </div>
        <div class="flex w-full justify-end pr-5 gap-3">
          <NuxtLink to="/" class="linkNav sm:block hidden">Home</NuxtLink>
          <NuxtLink to="/credits" class="linkNav hidden sm:block"
            >Crediti</NuxtLink
          >
          <SheetTrigger class="sm:hidden block"><Menu /></SheetTrigger>
        </div>
      </div>
    </div>
  </Sheet>
</template>

<style scoped>
.linkNav {
  @apply p-3 hover:bg-white/30 hover:backdrop-blur-2xl rounded-full transition-all px-5;
}
</style>
