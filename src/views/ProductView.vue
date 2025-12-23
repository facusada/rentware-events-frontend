<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import BaseBadge from "@/components/base/BaseBadge.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import { useCatalogStore, type Product } from "@/stores/catalog";
import { useCartStore } from "@/stores/cart";

const route = useRoute();
const catalog = useCatalogStore();
const cart = useCartStore();
const product = ref<Product | null>(null);
const quantity = ref(1);
const days = ref(1);

onMounted(async () => {
  if (!catalog.products.length) await catalog.fetchCatalog();
  product.value = catalog.products.find((p) => p.id === route.params.id);
});

async function addToCart() {
  if (!product.value) return;
  await cart.addItem(product.value, quantity.value, days.value);
}
</script>

<template>
  <div v-if="product" class="grid gap-6 md:grid-cols-2">
    <img :src="product.photo_url || 'https://images.unsplash.com/photo-1495435229349-e86db7bfa013?auto=format&fit=crop&w=800&q=60'" class="card-surface h-full w-full rounded-xl object-cover" />
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <h1 class="text-2xl font-bold text-slate-900">{{ product.name }}</h1>
        <BaseBadge v-if="product.requires_guarantee" tone="warning">Garantía</BaseBadge>
      </div>
      <p class="text-slate-700">{{ product.description }}</p>
      <p class="text-lg font-semibold text-slate-900">${{ product.base_price }} / día</p>
      <p class="text-sm text-slate-600">Unidades por caja: {{ product.units_per_box }}</p>
      <div class="flex gap-4">
        <label class="space-y-1 text-sm">
          <span class="form-label">Cantidad</span>
          <input v-model.number="quantity" type="number" min="1" class="input w-24" />
        </label>
        <label class="space-y-1 text-sm">
          <span class="form-label">Días de evento</span>
          <input v-model.number="days" type="number" min="1" class="input w-28" />
        </label>
      </div>
      <BaseButton @click="addToCart">Agregar al carrito</BaseButton>
      <p class="text-xs text-slate-600">En temporada alta solicitamos 50% de reserva. La garantía es reintegrable si no hay roturas.</p>
    </div>
  </div>
  <div v-else class="text-center text-slate-500">Cargando producto...</div>
</template>
