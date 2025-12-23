<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ variant?: "primary" | "secondary" | "ghost"; loading?: boolean; type?: "button" | "submit" | "reset"; full?: boolean }>();
const variantClass = computed(() => {
  switch (props.variant) {
    case "secondary":
      return "bg-slate-900 text-white hover:bg-slate-800";
    case "ghost":
      return "bg-transparent text-[rgb(var(--color-secondary))] border border-slate-200 hover:border-slate-300";
    default:
      return "bg-[rgb(var(--color-primary))] text-white shadow-md shadow-blue-200 hover:brightness-110";
  }
});
</script>

<template>
  <button
    :type="props.type || 'button'"
    class="btn"
    :class="[variantClass, props.full ? 'w-full' : '']"
    :disabled="props.loading"
  >
    <span v-if="props.loading" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
    <slot />
  </button>
</template>
