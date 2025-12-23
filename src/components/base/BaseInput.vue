<script setup lang="ts">
const props = defineProps<{
  label?: string;
  modelValue?: string | number;
  type?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
}>();
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <label class="block w-full space-y-1">
    <span v-if="label" class="form-label">
      {{ label }}
      <span v-if="props.required" class="text-red-500">*</span>
    </span>
    <input
      class="input"
      :value="props.modelValue"
      :type="props.type || 'text'"
      :placeholder="props.placeholder"
      :required="props.required"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
  </label>
</template>
