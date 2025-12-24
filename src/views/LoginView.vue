<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseInput from "@/components/base/BaseInput.vue";
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/toast";

const email = ref("");
const password = ref("");
const router = useRouter();
const auth = useAuthStore();
const toast = useToastStore();

async function submit() {
  if (!email.value || !password.value) {
    toast.warning("Completá email y contraseña.");
    return;
  }
  try {
    await auth.login(email.value, password.value);
    router.push("/");
  } catch (error) {
    // El toast global ya muestra el detalle
  }
}
</script>

<template>
  <div class="flex min-h-[80vh] items-center justify-center">
    <form class="card-surface w-full max-w-md space-y-4 p-8" @submit.prevent="submit">
      <div class="flex items-center gap-3">
        <img src="https://dummyimage.com/48x48/0d6efd/ffffff&text=RW" alt="logo" class="h-12 w-12 rounded-lg" />
        <div>
          <p class="text-xs font-bold uppercase tracking-wide text-[rgb(var(--color-secondary))]">Rentware</p>
          <h1 class="text-xl font-bold text-slate-900">Accedé a tu panel</h1>
        </div>
      </div>
      <BaseInput v-model="email" label="Email" type="email" required autofocus />
      <BaseInput v-model="password" label="Contraseña" type="password" required />
      <BaseButton type="submit" full>Iniciar sesión</BaseButton>
      <p class="text-sm text-slate-600">¿No tienes cuenta? <router-link to="/register">Crear</router-link></p>
    </form>
  </div>
</template>
