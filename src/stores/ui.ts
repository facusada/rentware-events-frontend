import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useUiStore = defineStore("ui", () => {
  const pendingRequests = ref(0);

  const isLoading = computed(() => pendingRequests.value > 0);

  function startLoading() {
    pendingRequests.value += 1;
  }

  function stopLoading() {
    pendingRequests.value = Math.max(0, pendingRequests.value - 1);
  }

  return { isLoading, startLoading, stopLoading };
});
