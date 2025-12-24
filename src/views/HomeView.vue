<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
</script>

<template>
  <section class="flex justify-center">
    <div class="card-surface w-full max-w-5xl space-y-6 p-10 text-center">
      <p class="mx-auto inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-primary))]">Reservas sin fricción</p>
      <h1 class="text-5xl font-bold leading-tight text-slate-900 md:text-6xl">Alquiler de vajilla y mobiliario listo para tu evento</h1>
      <p class="text-lg text-slate-700 md:text-xl">Gestiona catálogo, stock, logística y garantías en un solo flujo. Calculamos días, contenedores y costos de traslado en tiempo real.</p>
      <div class="flex flex-wrap justify-center gap-3">
        <router-link to="/catalog" class="btn btn-primary px-6 py-3 text-base">Ver catálogo</router-link>
        <router-link v-if="auth.isAuthenticated && auth.isAdmin" to="/admin" class="btn btn-secondary px-6 py-3 text-base">Panel admin</router-link>
      </div>
      <div class="grid grid-cols-1 gap-3 text-sm text-slate-700 sm:grid-cols-3">
        <div class="rounded-lg border border-slate-100 bg-slate-50/60 p-4">
          <p class="font-semibold text-slate-900">Reserva confirmada</p>
          <p>Bloqueo de stock al aprobar</p>
        </div>
        <div class="rounded-lg border border-slate-100 bg-slate-50/60 p-4">
          <p class="font-semibold text-slate-900">Logística granular</p>
          <p>Base + hora + peajes</p>
        </div>
        <div class="rounded-lg border border-slate-100 bg-slate-50/60 p-4">
          <p class="font-semibold text-slate-900">Garantía visible</p>
          <p>Con IVA opcional</p>
        </div>
      </div>
    </div>
  </section>
</template>
