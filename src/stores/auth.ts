import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useApi } from "@/composables/useApi";
import { useCartStore } from "./cart";
import { useToastStore } from "./toast";

interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<Token | null>(null);
  const loading = ref(false);
  const toast = useToastStore();

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === "admin" || user.value?.role === "operator");

  function setAuth(payload: { user: User; token: Token }) {
    user.value = payload.user;
    token.value = payload.token;
    localStorage.setItem("auth_token", JSON.stringify(payload.token));
    localStorage.setItem("auth_user", JSON.stringify(payload.user));
  }

  async function restore() {
    const saved = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");
    if (saved) token.value = JSON.parse(saved);
    if (savedUser) user.value = JSON.parse(savedUser);
  }

  async function login(email: string, password: string) {
    loading.value = true;
    try {
      const api = useApi();
      const { data } = await api.post("/auth/login", { email, password });
      setAuth(data);
      const cart = useCartStore();
      await cart.mergeWithSession();
      toast.success("Sesión iniciada");
    } finally {
      loading.value = false;
    }
  }

  async function register(payload: { email: string; password: string; full_name?: string }) {
    loading.value = true;
    try {
      const api = useApi();
      const { data } = await api.post("/auth/register", payload);
      setAuth(data);
      const cart = useCartStore();
      await cart.mergeWithSession();
      toast.success("Cuenta creada");
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    toast.info("Sesión cerrada");
  }

  return { user, token, isAuthenticated, isAdmin, loading, login, register, logout, restore };
});
