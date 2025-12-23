<script setup lang="ts">
import { computed } from "vue";
import { useToastStore, type ToastMessage, type ToastType } from "@/stores/toast";

const toastStore = useToastStore();
const toasts = computed(() => toastStore.toasts);

const toneStyles: Record<ToastType, string> = {
  success: "border-green-200 bg-white text-green-800",
  error: "border-red-200 bg-white text-red-800",
  warning: "border-amber-200 bg-white text-amber-800",
  info: "border-slate-200 bg-white text-slate-800",
};

const badgeStyles: Record<ToastType, string> = {
  success: "bg-green-100 text-green-700",
  error: "bg-red-100 text-red-700",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-slate-100 text-slate-700",
};

const labels: Record<ToastType, string> = {
  success: "Listo",
  error: "Error",
  warning: "Aviso",
  info: "Info",
};

function dismiss(toast: ToastMessage) {
  toastStore.dismiss(toast.id);
}
</script>

<template>
  <div class="pointer-events-none fixed right-4 top-4 z-50 flex flex-col gap-3 sm:right-6 sm:top-6">
    <TransitionGroup name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex min-w-[280px] max-w-[360px] items-start gap-3 rounded-2xl border px-4 py-3 shadow-xl shadow-slate-900/10 backdrop-blur"
        :class="toneStyles[toast.type]"
      >
        <div class="mt-1 flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold uppercase" :class="badgeStyles[toast.type]">
          {{ labels[toast.type][0] }}
        </div>
        <div class="flex-1">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ labels[toast.type] }}</p>
          <p class="text-sm leading-snug">{{ toast.message }}</p>
        </div>
        <button class="ml-2 text-slate-400 transition hover:text-slate-600" @click="dismiss(toast)">
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
