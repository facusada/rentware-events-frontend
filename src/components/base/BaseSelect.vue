<script setup lang="ts">
interface Option {
  label: string;
  value: string | number;
}
const props = defineProps<{ label?: string; modelValue?: string | number; options: Option[]; placeholder?: string }>();
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <label class="block space-y-1">
    <span v-if="label" class="form-label">{{ label }}</span>
    <select
      class="input"
      :value="props.modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option value="" disabled selected>{{ props.placeholder || 'Seleccionar' }}</option>
      <option v-for="opt in props.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
  </label>
</template>
