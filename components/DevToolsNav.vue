<script lang="ts" setup>
import { devtools } from "~/stores/engine";
</script>

<template>
  <div class="p-2">
    <Button @click="devtools.toggle()">Toggle inspector</Button>
  </div>
</template>

<style></style>
