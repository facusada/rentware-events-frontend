<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
</script>

<template>
  <section class="space-y-3">
    <h1 class="text-2xl font-bold text-slate-900">Perfil</h1>
    <div class="card-surface space-y-2 p-4">
      <p class="text-sm text-slate-600">Nombre: {{ auth.user?.full_name }}</p>
      <p class="text-sm text-slate-600">Email: {{ auth.user?.email }}</p>
      <p class="text-sm text-slate-600">Rol: {{ auth.user?.role }}</p>
      <router-link to="/orders" class="btn btn-primary">Ver órdenes</router-link>
    </div>
  </section>
</template>
