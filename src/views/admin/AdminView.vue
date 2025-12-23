<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseCard from "@/components/base/BaseCard.vue";
import BaseTable from "@/components/base/BaseTable.vue";
import BaseBadge from "@/components/base/BaseBadge.vue";
import EmptyState from "@/components/base/EmptyState.vue";
import { useCatalogStore } from "@/stores/catalog";
import { useApi } from "@/composables/useApi";
import { useToastStore } from "@/stores/toast";

const catalog = useCatalogStore();
const api = useApi();
const toast = useToastStore();
const logistics = reactive({ base_fee: 0, hourly_vehicle_fee: 0, default_tolls: 0, notes: "" });
const guarantee = reactive({ percentage: 0.15, apply_tax: true, tax_rate: 0.21 });
const loading = ref(false);
const seasons = ref<any[]>([]);
const movements = ref<any[]>([]);
const newSeason = reactive({ name: "Temporada", start_date: "", end_date: "", high_season: true, deposit_ratio: 0.5 });

onMounted(async () => {
  await catalog.fetchCatalog();
  try {
    const { data: logi } = await api.get("/config/logistics");
    Object.assign(logistics, logi);
    const { data: guar } = await api.get("/config/guarantee");
    Object.assign(guarantee, guar);
    const { data: seasonData } = await api.get("/config/seasons");
    seasons.value = seasonData;
    await loadMovements();
  } catch (error) {
    toast.warning("Ingresá como admin para ver y editar la configuración.");
  }
});

async function loadMovements() {
  try {
    const { data } = await api.get("/stock/movements");
    movements.value = data;
  } catch (error) {
    toast.error("No se pudieron obtener los movimientos.");
  }
}

async function saveConfig() {
  if (logistics.base_fee === null || logistics.hourly_vehicle_fee === null || logistics.default_tolls === null) {
    toast.warning("Completá los campos de logística.");
    return;
  }
  if (guarantee.percentage === null || guarantee.tax_rate === null) {
    toast.warning("Completá los campos de garantía.");
    return;
  }
  loading.value = true;
  try {
    await api.put("/config/logistics", logistics);
    await api.put("/config/guarantee", guarantee);
    toast.success("Configuración guardada");
  } finally {
    loading.value = false;
  }
}

async function addSeason() {
  if (!newSeason.name || !newSeason.start_date || !newSeason.end_date || newSeason.deposit_ratio === null) {
    toast.warning("Completá todos los datos de la temporada.");
    return;
  }
  if (newSeason.start_date > newSeason.end_date) {
    toast.warning("La fecha de inicio debe ser anterior a la de fin.");
    return;
  }
  loading.value = true;
  try {
    const { data } = await api.post("/config/seasons", newSeason);
    seasons.value.push(data);
    Object.assign(newSeason, { name: "Temporada", start_date: "", end_date: "", high_season: true, deposit_ratio: 0.5 });
    toast.success("Temporada agregada");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Panel admin</h1>
      <p class="text-sm text-slate-600">Gestión de productos, stock y configuración de logística/temporadas.</p>
    </div>

    <BaseCard>
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-lg font-semibold">Catálogo</h2>
        <BaseButton variant="ghost">Nuevo producto</BaseButton>
      </div>
      <BaseTable>
        <template #head>
          <th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Nombre</th>
          <th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Precio</th>
          <th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Garantía</th>
          <th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Caja</th>
        </template>
        <tr v-for="product in catalog.products" :key="product.id">
          <td class="px-3 py-2 text-sm font-semibold text-slate-900">{{ product.name }}</td>
          <td class="px-3 py-2 text-sm">${{ product.base_price }}</td>
          <td class="px-3 py-2 text-sm"><BaseBadge :tone="product.requires_guarantee ? 'warning' : 'info'">{{ product.requires_guarantee ? 'Sí' : 'No' }}</BaseBadge></td>
          <td class="px-3 py-2 text-sm">{{ product.units_per_box }}</td>
        </tr>
      </BaseTable>
    </BaseCard>

    <div class="grid gap-4 md:grid-cols-2">
      <BaseCard class="space-y-3">
        <h3 class="text-lg font-semibold">Logística</h3>
        <label class="text-sm">Base
          <span class="text-red-500">*</span>
          <input v-model.number="logistics.base_fee" type="number" class="input" required />
        </label>
        <label class="text-sm">Hora por vehículo
          <span class="text-red-500">*</span>
          <input v-model.number="logistics.hourly_vehicle_fee" type="number" class="input" required />
        </label>
        <label class="text-sm">Peajes / default
          <span class="text-red-500">*</span>
          <input v-model.number="logistics.default_tolls" type="number" class="input" required />
        </label>
      </BaseCard>
      <BaseCard class="space-y-3">
        <h3 class="text-lg font-semibold">Garantía</h3>
        <label class="text-sm">Porcentaje
          <span class="text-red-500">*</span>
          <input v-model.number="guarantee.percentage" type="number" step="0.01" class="input" required />
        </label>
        <label class="text-sm">IVA garantía
          <span class="text-red-500">*</span>
          <input v-model.number="guarantee.tax_rate" type="number" step="0.01" class="input" required />
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="guarantee.apply_tax" /> Aplicar IVA
        </label>
      </BaseCard>
    </div>
    <BaseButton @click="saveConfig" :loading="loading">Guardar configuración</BaseButton>

    <BaseCard class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Temporadas</h3>
        <BaseBadge tone="info">Alta bloquea 50%</BaseBadge>
      </div>
      <div class="grid gap-2 md:grid-cols-5">
        <label class="space-y-1 text-sm">
          <span class="form-label">Nombre <span class="text-red-500">*</span></span>
          <input v-model="newSeason.name" placeholder="Nombre" class="input" required />
        </label>
        <label class="space-y-1 text-sm">
          <span class="form-label">Inicio <span class="text-red-500">*</span></span>
          <input v-model="newSeason.start_date" type="date" class="input" required />
        </label>
        <label class="space-y-1 text-sm">
          <span class="form-label">Fin <span class="text-red-500">*</span></span>
          <input v-model="newSeason.end_date" type="date" class="input" required />
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="newSeason.high_season" /> Alta
        </label>
        <label class="space-y-1 text-sm">
          <span class="form-label">Depósito <span class="text-red-500">*</span></span>
          <input v-model.number="newSeason.deposit_ratio" type="number" step="0.1" class="input" required />
        </label>
      </div>
    <BaseButton variant="ghost" @click="addSeason" :loading="loading">Agregar temporada</BaseButton>
    <div class="space-y-2 text-sm text-slate-700">
      <div v-for="season in seasons" :key="season.id" class="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
        <div>
          <p class="font-semibold">{{ season.name }}</p>
            <p class="text-xs text-slate-500">{{ season.start_date }} → {{ season.end_date }}</p>
        </div>
        <BaseBadge :tone="season.high_season ? 'warning' : 'info'">{{ season.high_season ? 'Alta' : 'Media' }}</BaseBadge>
      </div>
    </div>
    </BaseCard>

    <BaseCard class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Movimientos de stock</h3>
        <BaseBadge tone="info">{{ movements.length }} registros</BaseBadge>
      </div>
      <div v-if="movements.length" class="overflow-auto">
        <table class="min-w-full text-sm text-left">
          <thead>
            <tr class="text-xs uppercase text-slate-500">
              <th class="px-2 py-2">Fecha</th>
              <th class="px-2 py-2">Producto</th>
              <th class="px-2 py-2">Depósito</th>
              <th class="px-2 py-2">Cambio</th>
              <th class="px-2 py-2">Motivo</th>
              <th class="px-2 py-2">Referencia</th>
              <th class="px-2 py-2">Monto</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="mov in movements" :key="mov.id" class="border-t border-slate-100">
              <td class="px-2 py-2 text-slate-700">{{ new Date(mov.created_at).toLocaleString() }}</td>
              <td class="px-2 py-2 text-slate-900 font-semibold">{{ mov.product_name }}</td>
              <td class="px-2 py-2 text-slate-700">{{ mov.warehouse_name }}</td>
              <td class="px-2 py-2">
                <BaseBadge :tone="mov.quantity_change >= 0 ? 'info' : 'warning'">
                  {{ mov.quantity_change >= 0 ? '+' : '' }}{{ mov.quantity_change }}
                </BaseBadge>
              </td>
              <td class="px-2 py-2 text-slate-700">{{ mov.reason }}</td>
              <td class="px-2 py-2 text-slate-700">{{ mov.reference || '—' }}</td>
              <td class="px-2 py-2 text-slate-700">{{ mov.amount ? `$${mov.amount}` : '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState
        v-else
        title="Sin movimientos aún"
        description="Cuando ajustes stock, ventas o registres devoluciones verás el historial aquí."
        icon="📦"
      />
    </BaseCard>
  </section>
</template>
