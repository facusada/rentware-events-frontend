import { defineStore } from "pinia";
import { ref } from "vue";
import { useApi } from "@/composables/useApi";

export interface ProductVariant {
  id: string;
  color?: string;
  material?: string;
  price_override?: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  base_price: number;
  requires_guarantee: boolean;
  units_per_box: number;
  piece_type?: string;
  condition_status?: string;
  photo_url?: string;
  variants: ProductVariant[];
}

export const useCatalogStore = defineStore("catalog", () => {
  const products = ref<Product[]>([]);
  const loading = ref(false);

  async function fetchCatalog(params: Record<string, string | number | boolean | undefined> = {}) {
    loading.value = true;
    try {
      const api = useApi();
      const { data } = await api.get("/catalog/public", { params });
      products.value = data;
    } finally {
      loading.value = false;
    }
  }

  return { products, loading, fetchCatalog };
});
