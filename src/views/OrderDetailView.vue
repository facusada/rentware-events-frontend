<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import BaseBadge from "@/components/base/BaseBadge.vue";
import BaseCard from "@/components/base/BaseCard.vue";
import { useOrdersStore, type Order } from "@/stores/orders";

const route = useRoute();
const store = useOrdersStore();
const order = ref<Order | null>(null);

onMounted(async () => {
  order.value = await store.fetchOrder(route.params.id as string);
});
</script>

<template>
  <section v-if="order" class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-900">Pedido {{ order.code }}</h1>
      <BaseBadge tone="info">{{ order.status }}</BaseBadge>
    </div>
    <BaseCard class="space-y-2 text-sm text-slate-700">
      <div class="flex justify-between"><span>Subtotal</span><span>${{ order.subtotal }}</span></div>
      <div class="flex justify-between"><span>Logística (base + hora + peajes)</span><span>${{ order.logistics_cost }}</span></div>
      <div class="flex justify-between"><span>Garantía</span><span>${{ order.guarantee_amount }}</span></div>
      <div class="flex justify-between font-semibold text-slate-900"><span>Total</span><span>${{ order.total }}</span></div>
      <p class="text-xs text-slate-500" v-if="order.high_season">Reserva requerida: ${{ order.reservation_required }}</p>
    </BaseCard>

    <BaseCard>
      <h3 class="mb-2 text-lg font-semibold text-slate-900">Items</h3>
      <div class="divide-y divide-slate-100">
        <div v-for="item in order.items" :key="item.id" class="flex items-center justify-between py-2 text-sm">
          <div>
            <p class="font-semibold">{{ item.product_name || item.product_id }}</p>
            <p class="text-slate-600">{{ item.quantity }} x {{ item.days }} días · Caja {{ item.units_per_box }}</p>
            <p v-if="item.variant_label" class="text-slate-500">{{ item.variant_label }}</p>
            <BaseBadge v-if="item.requires_guarantee" tone="warning">Garantía</BaseBadge>
          </div>
          <span class="font-semibold">${{ item.total_price }}</span>
        </div>
      </div>
    </BaseCard>
  </section>
  <div v-else class="text-slate-600">Cargando pedido...</div>
</template>
