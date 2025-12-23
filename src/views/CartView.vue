<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseBadge from "@/components/base/BaseBadge.vue";
import BaseCard from "@/components/base/BaseCard.vue";
import { useCartStore } from "@/stores/cart";
import { useApi } from "@/composables/useApi";

const cartStore = useCartStore();
const router = useRouter();
const logistics = ref({ base_fee: 0, hourly_vehicle_fee: 0, default_tolls: 0 });
const guarantee = ref({ percentage: 0.15, apply_tax: true, tax_rate: 0.21 });

onMounted(async () => {
  await cartStore.loadCart();
  const api = useApi();
  try {
    const { data: logi } = await api.get("/config/logistics");
    logistics.value = logi;
    const { data: guar } = await api.get("/config/guarantee");
    guarantee.value = guar;
  } catch (error) {
    // public read not critical
  }
});

const subtotal = computed(() => cartStore.cart?.items.reduce((acc, item) => acc + Number(item.price_per_day) * item.quantity * item.days, 0) || 0);
const logisticsCost = computed(() => {
  if (!cartStore.cart) return 0;
  const hours = cartStore.cart.logistics_hours || 1;
  const tolls = cartStore.cart.tolls || 0;
  return Number(logistics.value.base_fee || 0) + Number(logistics.value.hourly_vehicle_fee || 0) * hours + Number(logistics.value.default_tolls || 0) + tolls;
});
const requiresGuarantee = computed(() => cartStore.cart?.items.some((i) => i.requires_guarantee));
const guaranteeAmount = computed(() => {
  if (!requiresGuarantee.value) return 0;
  const pct = Number(guarantee.value.percentage || 0);
  const base = subtotal.value * pct;
  const tax = guarantee.value.apply_tax ? base * Number(1 + Number(guarantee.value.tax_rate || 0)) : base;
  return Math.round(tax * 100) / 100;
});
const total = computed(() => subtotal.value + logisticsCost.value + guaranteeAmount.value);

async function updateQuantity(itemId: string, quantity: number, days: number) {
  await cartStore.updateItem(itemId, quantity, days);
}

async function updateDetails() {
  if (!cartStore.cart) return;
  await cartStore.updateDetails({
    logistics_hours: cartStore.cart.logistics_hours,
    tolls: cartStore.cart.tolls,
    delivery_address: cartStore.cart.delivery_address,
    delivery_type: cartStore.cart.delivery_type,
    event_start: cartStore.cart.event_start,
    event_end: cartStore.cart.event_end,
  });
}

async function goCheckout() {
  await updateDetails();
  router.push("/checkout");
}

function boxesRequired(quantity: number, unitsPerBox: number) {
  if (!unitsPerBox || unitsPerBox <= 0) return 0;
  return Math.ceil(quantity / unitsPerBox);
}
</script>

<template>
  <section v-if="cartStore.cart" class="grid gap-6 md:grid-cols-3">
    <div class="md:col-span-2 space-y-4">
      <BaseCard v-for="item in cartStore.cart.items" :key="item.id">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-lg font-semibold text-slate-900">{{ item.product_id }}</p>
            <p class="text-sm text-slate-600">${{ item.price_per_day }} / día · {{ item.units_per_box }} unidades por caja</p>
            <p class="text-xs text-slate-500">Cajas requeridas: {{ boxesRequired(item.quantity, item.units_per_box) }}</p>
            <BaseBadge v-if="item.requires_guarantee" tone="warning">Garantía requerida</BaseBadge>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <input v-model.number="item.quantity" type="number" min="1" class="input w-16" @change="updateQuantity(item.id, item.quantity, item.days)" />
            <input v-model.number="item.days" type="number" min="1" class="input w-16" @change="updateQuantity(item.id, item.quantity, item.days)" />
            <BaseButton variant="ghost" @click="cartStore.removeItem(item.id)">Eliminar</BaseButton>
          </div>
        </div>
      </BaseCard>
      <div v-if="!cartStore.cart.items.length" class="text-sm text-slate-600">Tu carrito está vacío.</div>
    </div>

    <BaseCard class="space-y-3">
      <h3 class="text-lg font-semibold text-slate-900">Detalle del evento</h3>
      <div class="grid grid-cols-2 gap-2 text-sm">
        <label class="space-y-1">
          <span class="form-label">Entrega <span class="text-red-500">*</span></span>
          <input v-model="cartStore.cart.event_start" type="date" class="input" required />
        </label>
        <label class="space-y-1">
          <span class="form-label">Devolución <span class="text-red-500">*</span></span>
          <input v-model="cartStore.cart.event_end" type="date" class="input" required />
        </label>
        <label class="space-y-1">
          <span class="form-label">Horas de logística <span class="text-red-500">*</span></span>
          <input v-model.number="cartStore.cart.logistics_hours" type="number" min="1" class="input" required />
        </label>
        <label class="space-y-1">
          <span class="form-label">Peajes / opcionales <span class="text-red-500">*</span></span>
          <input v-model.number="cartStore.cart.tolls" type="number" min="0" class="input" required />
        </label>
      </div>
      <label class="space-y-1 text-sm">
        <span class="form-label">Dirección (delivery) o depósito <span class="text-red-500">*</span></span>
        <input v-model="cartStore.cart.delivery_address" class="input" placeholder="Dirección" required />
      </label>
      <div class="flex items-center gap-3 text-sm">
        <label class="flex items-center gap-2">
          <input type="radio" value="delivery" v-model="cartStore.cart.delivery_type" /> Delivery
        </label>
        <label class="flex items-center gap-2">
          <input type="radio" value="pickup" v-model="cartStore.cart.delivery_type" /> Retira en depósito
        </label>
      </div>
      <BaseButton @click="updateDetails" variant="ghost">Guardar datos</BaseButton>

      <div class="space-y-2 border-t pt-3 text-sm text-slate-700">
        <div class="flex justify-between"><span>Subtotal (días)</span><span>${{ subtotal.toFixed(2) }}</span></div>
        <div class="flex justify-between"><span>Logística (base + hora + peajes)</span><span>${{ logisticsCost.toFixed(2) }}</span></div>
        <div class="flex justify-between">
          <span>Garantía reintegrable</span>
          <span>${{ guaranteeAmount.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between text-base font-semibold text-slate-900">
          <span>Total estimado</span>
          <span>${{ total.toFixed(2) }}</span>
        </div>
        <p class="text-xs text-slate-500">Si es temporada alta, se requiere 50% de reserva y el resto 48h antes.</p>
      </div>
      <BaseButton :disabled="!cartStore.cart.items.length" full @click="goCheckout">Confirmar pedido</BaseButton>
    </BaseCard>
  </section>
  <div v-else class="text-center text-slate-600">Cargando carrito...</div>
</template>
