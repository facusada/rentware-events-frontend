import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useApi } from "@/composables/useApi";
import type { Product } from "./catalog";
import { useToastStore } from "./toast";
import { useAuthStore } from "./auth";
import router from "@/router";

export interface CartItem {
  id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  days: number;
  price_per_day: number;
  requires_guarantee: boolean;
  units_per_box: number;
}

export interface Cart {
  id: string;
  session_token: string;
  delivery_type: string;
  delivery_address?: string;
  event_start?: string;
  event_end?: string;
  logistics_hours?: number;
  tolls?: number;
  notes?: string;
  items: CartItem[];
}

function ensureSessionToken() {
  let token = localStorage.getItem("session_token");
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem("session_token", token);
  }
  return token;
}

export const useCartStore = defineStore("cart", () => {
  const api = useApi();
  const cart = ref<Cart | null>(null);
  const loading = ref(false);
  const toast = useToastStore();
  const auth = useAuthStore();

  const itemsCount = computed(() => cart.value?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0);

  async function loadCart() {
    loading.value = true;
    try {
      const sessionToken = ensureSessionToken();
      const { data } = await api.get("/cart", { headers: { "X-Session-Token": sessionToken } });
      cart.value = data;
    } catch (error) {
      // If not exists create
      const sessionToken = ensureSessionToken();
      const { data } = await api.post("/cart", { session_token: sessionToken, delivery_type: "pickup" });
      cart.value = data;
    } finally {
      loading.value = false;
    }
  }

  async function addItem(product: Product, quantity: number, days: number) {
    const sessionToken = ensureSessionToken();
    await api.post(
      "/cart/items",
      {
        product_id: product.id,
        quantity,
        days,
        price_per_day: product.base_price,
        requires_guarantee: product.requires_guarantee,
        units_per_box: product.units_per_box,
      },
      { headers: { "X-Session-Token": sessionToken } }
    );
    await loadCart();
    toast.success("Producto agregado al carrito");
  }

  async function updateItem(itemId: string, quantity: number, days: number) {
    const sessionToken = ensureSessionToken();
    await api.patch(
      `/cart/items/${itemId}`,
      { quantity, days },
      { headers: { "X-Session-Token": sessionToken } }
    );
    await loadCart();
  }

  async function removeItem(itemId: string) {
    const sessionToken = ensureSessionToken();
    await api.delete(`/cart/items/${itemId}`, { headers: { "X-Session-Token": sessionToken } });
    await loadCart();
    toast.warning("Producto eliminado del carrito");
  }

  async function mergeWithSession() {
    const sessionToken = localStorage.getItem("session_token");
    if (!sessionToken) return;
    try {
      const { data } = await api.post("/cart/merge", {}, { headers: { "X-Session-Token": sessionToken } });
      cart.value = data;
    } catch (error) {
      // ignore
    }
  }

  async function checkout() {
    if (!cart.value) return null;
    if (!auth.isAuthenticated) {
      toast.warning("Inicia sesión para confirmar tu pedido.");
      router.push({ name: "login" });
      return null;
    }
    const { data } = await api.post("/orders/checkout", { cart_id: cart.value.id });
    toast.success("Pedido confirmado");
    return data;
  }

  async function updateDetails(payload: Partial<Cart>) {
    const sessionToken = ensureSessionToken();
    if (!payload.event_start || !payload.event_end || !payload.delivery_address) {
      toast.warning("Completá las fechas y la dirección.");
      return;
    }
    await api.patch("/cart", payload, { headers: { "X-Session-Token": sessionToken } });
    await loadCart();
    toast.success("Datos del evento actualizados");
  }

  return { cart, loading, itemsCount, loadCart, addItem, updateItem, removeItem, mergeWithSession, checkout, updateDetails };
});
