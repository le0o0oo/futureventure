<template>
  <div v-auto-animate>
    <Check v-if="checked" class="text-green-600" /><X
      class="text-red-600"
      v-else
    />
  </div>
</template>

<script lang="ts" setup>
import { Check, X } from "lucide-vue-next";

defineProps<{ checked: boolean }>();
</script>

<style></style>
