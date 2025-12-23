import { defineStore } from "pinia";
import { ref } from "vue";
import { useApi } from "@/composables/useApi";

export interface OrderItem {
  id: string;
  product_id: string;
  product_name?: string | null;
  variant_id?: string | null;
  variant_label?: string | null;
  quantity: number;
  days: number;
  unit_price: number;
  total_price: number;
  requires_guarantee: boolean;
  units_per_box: number;
}

export interface Order {
  id: string;
  code: string;
  status: string;
  subtotal: number;
  logistics_cost: number;
  guarantee_amount: number;
  total: number;
  reservation_required: number;
  outstanding_balance: number;
  requires_guarantee: boolean;
  high_season: boolean;
  items: OrderItem[];
}

export const useOrdersStore = defineStore("orders", () => {
  const orders = ref<Order[]>([]);
  const loading = ref(false);

  async function fetchOrders() {
    loading.value = true;
    try {
      const api = useApi();
      const { data } = await api.get("/orders");
      orders.value = data;
    } finally {
      loading.value = false;
    }
  }

  async function fetchOrder(id: string): Promise<Order> {
    const api = useApi();
    const { data } = await api.get(`/orders/${id}`);
    return data;
  }

  return { orders, loading, fetchOrders, fetchOrder };
});
