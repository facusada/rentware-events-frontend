<script setup lang="ts">
import { onMounted } from "vue";
import BaseBadge from "@/components/base/BaseBadge.vue";
import BaseCard from "@/components/base/BaseCard.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import EmptyState from "@/components/base/EmptyState.vue";
import { useOrdersStore } from "@/stores/orders";

const store = useOrdersStore();

onMounted(async () => {
  await store.fetchOrders();
});
</script>

<template>
  <section class="space-y-4">
    <h1 class="text-2xl font-bold text-slate-900">Mis pedidos</h1>
    <EmptyState
      v-if="store.orders.length === 0 && !store.loading"
      title="Aún no tenés pedidos"
      description="Cuando confirmes tu primer pedido, vas a verlo listado acá con su estado y detalle."
      cta-label="Ir al catálogo"
      cta-to="/catalog"
      icon="🧾"
    />
    <div v-else class="grid gap-3 md:grid-cols-2">
      <BaseCard v-for="order in store.orders" :key="order.id" class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-lg font-semibold text-slate-900">{{ order.code }}</p>
          <BaseBadge tone="info">{{ order.status }}</BaseBadge>
        </div>
        <p class="text-sm text-slate-600">Garantía: ${{ order.guarantee_amount }}</p>
        <p class="text-sm text-slate-600">Total: ${{ order.total }}</p>
        <router-link :to="`/orders/${order.id}`" class="btn btn-ghost">Ver detalle</router-link>
      </BaseCard>
    </div>
  </section>
</template>
