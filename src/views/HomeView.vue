<template>
  <section class="grid gap-8 md:grid-cols-5">
    <div class="card-surface md:col-span-3 space-y-5 p-8">
      <p class="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-primary))]">Reservas sin fricción</p>
      <h1 class="text-4xl font-bold leading-tight text-slate-900">Alquiler de vajilla y mobiliario listo para tu evento</h1>
      <p class="text-lg text-slate-700">Gestiona catálogo, stock, logística y garantías en un solo flujo. Calculamos días, contenedores y costos de traslado en tiempo real.</p>
      <div class="flex flex-wrap gap-3">
        <router-link to="/catalog" class="btn btn-primary">Ver catálogo</router-link>
        <router-link to="/admin" class="btn btn-secondary">Panel admin</router-link>
      </div>
      <div class="grid grid-cols-3 gap-4 text-sm text-slate-700">
        <div>
          <p class="font-semibold text-slate-900">Reserva confirmada</p>
          <p>Bloqueo de stock al aprobar</p>
        </div>
        <div>
          <p class="font-semibold text-slate-900">Logística granular</p>
          <p>Base + hora + peajes</p>
        </div>
        <div>
          <p class="font-semibold text-slate-900">Garantía visible</p>
          <p>Con IVA opcional</p>
        </div>
      </div>
    </div>
    <div class="card-surface relative md:col-span-2 space-y-4 p-8">
      <div class="absolute right-6 top-6 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">Temporada alta</div>
      <h3 class="text-lg font-semibold text-slate-900">Resumen pedido</h3>
      <div class="space-y-2 text-sm text-slate-700">
        <div class="flex justify-between">
          <span>Alquiler vajilla (3 días)</span>
          <span>$72.000</span>
        </div>
        <div class="flex justify-between">
          <span>Logística (base + 2h + peajes)</span>
          <span>$8.500</span>
        </div>
        <div class="flex justify-between">
          <span>Garantía reintegrable</span>
          <span>$10.800</span>
        </div>
        <div class="flex justify-between font-semibold text-slate-900">
          <span>Total estimado</span>
          <span>$91.300</span>
        </div>
        <p class="text-xs text-slate-500">Reserva 50% en temporada alta. Unidades por caja siempre visibles.</p>
      </div>
    </div>
  </section>
</template>
