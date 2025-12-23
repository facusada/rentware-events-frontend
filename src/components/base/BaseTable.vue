<template>
  <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <table class="min-w-full divide-y divide-slate-100">
      <thead class="bg-slate-50">
        <tr>
          <slot name="head" />
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 bg-white">
        <slot />
      </tbody>
    </table>
  </div>
</template>
