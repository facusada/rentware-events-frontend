<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseInput from "@/components/base/BaseInput.vue";
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/toast";

const email = ref("");
const password = ref("");
const fullName = ref("");
const router = useRouter();
const auth = useAuthStore();
const toast = useToastStore();

async function submit() {
  if (!fullName.value || !email.value || !password.value) {
    toast.warning("Completa nombre, email y contraseña.");
    return;
  }
  try {
    await auth.register({ email: email.value, password: password.value, full_name: fullName.value });
    router.push("/");
  } catch (error) {
    // El toast global ya muestra el detalle
  }
}
</script>

<template>
  <div class="flex min-h-[80vh] items-center justify-center">
    <div class="card-surface w-full max-w-md space-y-4 p-8">
      <div class="flex items-center gap-3">
        <img src="https://dummyimage.com/48x48/0d6efd/ffffff&text=RW" alt="logo" class="h-12 w-12 rounded-lg" />
        <div>
          <p class="text-xs font-bold uppercase tracking-wide text-[rgb(var(--color-secondary))]">Rentware</p>
          <h1 class="text-xl font-bold text-slate-900">Crear cuenta</h1>
        </div>
      </div>
      <BaseInput v-model="fullName" label="Nombre" required />
      <BaseInput v-model="email" label="Email" type="email" required />
      <BaseInput v-model="password" label="Contraseña" type="password" required />
      <BaseButton full @click="submit">Registrarme</BaseButton>
    </div>
  </div>
</template>
