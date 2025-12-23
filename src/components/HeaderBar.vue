<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";
import BaseBadge from "@/components/base/BaseBadge.vue";

const auth = useAuthStore();
const cart = useCartStore();

const initials = computed(() => auth.user?.full_name?.slice(0, 1).toUpperCase() || "");

function handleLogout() {
  auth.logout();
}

onMounted(() => {
  cart.loadCart();
});
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
    <div class="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
      <div class="flex items-center gap-2">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgb(var(--color-primary))] text-white font-bold">RW</div>
        <div>
          <router-link to="/" class="text-lg font-bold text-slate-900 leading-tight">Rentware Events</router-link>
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Logística y reservas</p>
        </div>
      </div>
      <nav class="flex items-center gap-3 text-sm font-semibold text-slate-700">
        <router-link to="/catalog" class="hover:text-[rgb(var(--color-primary))]">Catálogo</router-link>
        <router-link to="/cart" class="hover:text-[rgb(var(--color-primary))]">Carrito</router-link>
        <router-link v-if="auth.isAuthenticated" to="/orders" class="hover:text-[rgb(var(--color-primary))]">Mis pedidos</router-link>
        <router-link v-if="auth.isAdmin" to="/admin" class="hover:text-[rgb(var(--color-primary))]">Admin</router-link>
        <router-link to="/cart" class="relative">
          <BaseBadge tone="info">{{ cart.itemsCount }} ítems</BaseBadge>
        </router-link>
        <router-link v-if="!auth.isAuthenticated" to="/login" class="btn btn-primary">Ingresar</router-link>
        <div v-else class="flex items-center gap-2">
          <router-link to="/profile" class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
            {{ initials }}
          </router-link>
          <button class="btn btn-secondary" @click="handleLogout">Salir</button>
        </div>
      </nav>
    </div>
  </header>
</template>
