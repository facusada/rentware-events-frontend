<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUiStore } from "@/stores/ui";

const ui = useUiStore();
const { isLoading } = storeToRefs(ui);
</script>

<template>
  <transition name="fade">
    <div
      v-if="isLoading"
      class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
    >
      <div class="flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-2 text-white shadow-lg shadow-slate-800/60">
        <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
        <span>Cargando...</span>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
