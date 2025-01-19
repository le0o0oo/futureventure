<script lang="ts" setup>
import { Loader2 } from "lucide-vue-next";
import { eventBus } from "~/event-bus";

const finaltaskStore = useFinalTaskStore();
finaltaskStore.testing.solarStorm = false;
finaltaskStore.testing.dataTransfer = true;

let currentTest = ref(0);
let loading = ref(true);

function runTest(type: "solarStorm" | "dataTransfer" | "both") {
  finaltaskStore.testing.testing = true;
  if (type === "solarStorm") finaltaskStore.testing.solarStorm = true;
  else finaltaskStore.testing.dataTransfer = true;

  eventBus.dispatchEvent(new CustomEvent("test_satellite", { detail: type }));
}

eventBus.addEventListener(
  "test_satellite_complete",
  (event: CustomEventInit) => {
    currentTest.value++;
    if (currentTest.value === 1) {
      runTest("solarStorm");
    } else if (currentTest.value === 2) {
      runTest("both");
    } else if (currentTest.value === 3) {
      loading.value = false;
      finaltaskStore.testing.testing = false;
      finaltaskStore.testing.dataTransfer = false;
      finaltaskStore.testing.solarStorm = false;
    }
  }
);

onMounted(() => {
  finaltaskStore.data_tansfer = false;
  finaltaskStore.solar_storms = false;
  finaltaskStore.every_task = false;
  runTest("dataTransfer");
});
</script>

<template>
  <div class="size-full">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Condizione</TableHead>
          <TableHead>Stato</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Puntando alla terra</TableCell>
          <TableCell>
            <CompletionIndicator :checked="finaltaskStore.pointingEarth" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Gestione trasferimento dati</TableCell>
          <TableCell>
            <CompletionIndicator :checked="finaltaskStore.data_tansfer" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Gestione tempeste solari</TableCell>
          <TableCell>
            <CompletionIndicator :checked="finaltaskStore.solar_storms" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <Separator class="my-3" />

    <h3 class="font-bold text-2xl mb-3">Test in esecuzione</h3>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Test</TableHead>
          <TableHead>Stato</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Gestione trasferimento dati</TableCell>
          <TableCell>
            <Loader2 class="animate-spin" v-if="currentTest == 0 && loading" />
            <CompletionIndicator
              :checked="finaltaskStore.data_tansfer"
              v-else
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Gestione tempeste solari</TableCell>
          <TableCell>
            <Loader2 class="animate-spin" v-if="currentTest == 1 && loading" />
            <CompletionIndicator
              :checked="finaltaskStore.solar_storms"
              v-else
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Gestione trasferimento dati con tempesta solare</TableCell>
          <TableCell>
            <Loader2 class="animate-spin" v-if="currentTest == 2 && loading" />
            <CompletionIndicator :checked="finaltaskStore.every_task" v-else />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div class="w-full flex items-center mt-3 justify-center gap-5">
      <Button @click="finaltaskStore.inFinalTest = false" :disabled="loading"
        >Indietro</Button
      >
      <Button>Completa 🎉</Button>
    </div>
  </div>
</template>

<style></style>
