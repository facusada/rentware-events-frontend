<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useCatalogStore } from "@/stores/catalog";
import BaseCard from "@/components/base/BaseCard.vue";
import BaseBadge from "@/components/base/BaseBadge.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import { useCartStore } from "@/stores/cart";

const catalog = useCatalogStore();
const cart = useCartStore();
const search = ref("");
const requireGuarantee = ref(false);
const maxPrice = ref<number | undefined>();

onMounted(async () => {
  await catalog.fetchCatalog();
  await cart.loadCart();
});

const filtered = computed(() => {
  return catalog.products.filter((p) => {
    const matchesSearch = !search.value || p.name.toLowerCase().includes(search.value.toLowerCase());
    const matchesGuarantee = !requireGuarantee.value || p.requires_guarantee;
    const matchesPrice = !maxPrice.value || p.base_price <= maxPrice.value;
    return matchesSearch && matchesGuarantee && matchesPrice;
  });
});

async function add(productId: string) {
  const product = catalog.products.find((p) => p.id === productId);
  if (!product) return;
  await cart.addItem(product, 1, 1);
}
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-wrap items-center gap-4">
      <input v-model="search" placeholder="Buscar" class="input w-60" />
      <label class="flex items-center gap-2 text-sm text-slate-700">
        <input v-model="requireGuarantee" type="checkbox" class="h-4 w-4" /> Requiere garantía
      </label>
      <div class="flex items-center gap-2">
        <span class="text-sm text-slate-600">Precio máx</span>
        <input v-model.number="maxPrice" type="number" class="input w-28" />
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <BaseCard v-for="product in filtered" :key="product.id">
        <div class="flex flex-col gap-3">
          <img :src="product.photo_url || 'https://images.unsplash.com/photo-1523365280197-f21d6cfc1c67?auto=format&fit=crop&w=500&q=60'" alt="" class="h-40 w-full rounded-lg object-cover" />
          <div class="flex items-start justify-between">
            <div>
              <p class="text-lg font-semibold text-slate-900">{{ product.name }}</p>
              <p class="text-sm text-slate-600">${{ product.base_price }} / día</p>
            </div>
            <BaseBadge v-if="product.requires_guarantee" tone="warning">Requiere garantía</BaseBadge>
          </div>
          <p class="text-sm text-slate-600 line-clamp-2">{{ product.description }}</p>
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span>Unidades por caja: {{ product.units_per_box }}</span>
            <span v-if="product.piece_type">Tipo: {{ product.piece_type }}</span>
          </div>
          <div class="flex gap-2">
            <router-link :to="`/product/${product.id}`" class="btn btn-ghost flex-1">Ver</router-link>
            <BaseButton class="flex-1" @click="add(product.id)">Agregar</BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>
  </section>
</template>
