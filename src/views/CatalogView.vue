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
const imageError = ref<Record<string, boolean>>({});

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

function hasValidImage(productId: string, photoUrl?: string | null) {
  return !!photoUrl && !imageError.value[productId];
}

function onImgError(productId: string) {
  imageError.value = { ...imageError.value, [productId]: true };
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
          <div class="relative h-40 w-full overflow-hidden rounded-lg bg-slate-100">
            <img
              v-if="hasValidImage(product.id, product.photo_url)"
              :src="product.photo_url"
              alt=""
              class="h-full w-full object-cover"
              loading="lazy"
              @error="onImgError(product.id)"
            />
            <div v-else class="flex h-full w-full flex-col items-center justify-center text-slate-500">
              <span class="text-2xl">🖼️</span>
              <span class="text-xs mt-1 font-medium">Sin imagen</span>
            </div>
          </div>
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
