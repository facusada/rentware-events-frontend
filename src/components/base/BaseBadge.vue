<script setup lang="ts">
const props = defineProps<{ tone?: 'success' | 'warning' | 'info' | 'danger' }>();
const tones: Record<string, string> = {
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  info: 'bg-blue-100 text-blue-800',
  danger: 'bg-red-100 text-red-700'
};
</script>

<template>
  <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold" :class="tones[props.tone || 'info']">
    <slot />
  </span>
</template>
