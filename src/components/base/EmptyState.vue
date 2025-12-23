<script setup lang="ts">
const props = defineProps<{
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaTo?: string;
  icon?: string;
}>();
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/80 px-6 py-10 text-center shadow-sm">
    <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500">
      <span v-if="props.icon">{{ props.icon }}</span>
      <span v-else>🗒️</span>
    </div>
    <h3 class="text-lg font-semibold text-slate-900">{{ props.title }}</h3>
    <p v-if="props.description" class="mt-1 max-w-md text-sm text-slate-600">
      {{ props.description }}
    </p>
    <router-link
      v-if="props.ctaTo && props.ctaLabel"
      :to="props.ctaTo"
      class="mt-4 inline-flex items-center gap-2 rounded-lg bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110"
    >
      {{ props.ctaLabel }}
    </router-link>
  </div>
</template>
