<template>
  <div class="min-h-screen bg-transparent flex flex-col">
    <HeaderBar />
    <main class="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-10 pt-8">
      <slot />
    </main>
    <FooterBar />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import HeaderBar from "@/components/HeaderBar.vue";
import FooterBar from "@/components/FooterBar.vue";
import ToastContainer from "@/components/base/ToastContainer.vue";
</script>
