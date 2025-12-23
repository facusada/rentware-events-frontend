<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import BaseBadge from "@/components/base/BaseBadge.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseCard from "@/components/base/BaseCard.vue";
import { useCartStore } from "@/stores/cart";
import type { Order } from "@/stores/orders";

const cart = useCartStore();
const router = useRouter();
const order = ref<Order | null>(null);

onMounted(async () => {
  const created = await cart.checkout();
  if (created) {
    order.value = created;
  }
});
</script>

<template>
  <section class="space-y-4" v-if="order">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-slate-500">Código</p>
        <h1 class="text-2xl font-bold text-slate-900">{{ order.code }}</h1>
      </div>
      <BaseBadge :tone="order.high_season ? 'warning' : 'info'">
        {{ order.high_season ? 'Temporada alta · reserva 50%' : 'Temporada normal' }}
      </BaseBadge>
    </div>

    <BaseCard class="space-y-2">
      <div class="flex justify-between text-sm text-slate-700">
        <span>Subtotal (días)</span>
        <span>${{ order.subtotal }}</span>
      </div>
      <div class="flex justify-between text-sm text-slate-700">
        <span>Logística</span>
        <span>${{ order.logistics_cost }}</span>
      </div>
      <div class="flex justify-between text-sm text-slate-700">
        <span>Garantía reintegrable</span>
        <span>${{ order.guarantee_amount }}</span>
      </div>
      <div class="flex justify-between text-base font-semibold text-slate-900">
        <span>Total</span>
        <span>${{ order.total }}</span>
      </div>
      <p class="text-xs text-slate-500" v-if="order.high_season">Reserva requerida: ${{ order.reservation_required }} · Saldo: ${{ order.outstanding_balance }}</p>
    </BaseCard>

    <BaseCard>
      <h3 class="mb-2 text-lg font-semibold">Items</h3>
      <div class="divide-y divide-slate-100">
        <div v-for="item in order.items" :key="item.id" class="flex items-center justify-between py-2 text-sm">
          <div>
            <p class="font-semibold text-slate-900">{{ item.product_id }}</p>
            <p class="text-slate-600">{{ item.quantity }} x {{ item.days }} días · caja {{ item.units_per_box }}</p>
            <BaseBadge v-if="item.requires_guarantee" tone="warning">Garantía</BaseBadge>
          </div>
          <span class="font-semibold">${{ item.total_price }}</span>
        </div>
      </div>
    </BaseCard>

    <div class="flex gap-3">
      <BaseButton variant="secondary" @click="router.push('/orders')">Ir a mis pedidos</BaseButton>
      <BaseButton variant="ghost" @click="router.push('/catalog')">Seguir navegando</BaseButton>
    </div>
  </section>
  <div v-else class="text-slate-600">Confirmando pedido...</div>
</template>
