import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/toast";
import { useUiStore } from "@/stores/ui";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

api.interceptors.request.use((config) => {
  const auth = useAuthStore();
  const ui = useUiStore();
  if (auth.token?.access_token) {
    config.headers.Authorization = `Bearer ${auth.token.access_token}`;
  }
  const sessionToken = localStorage.getItem("session_token");
  if (sessionToken) {
    config.headers["X-Session-Token"] = sessionToken;
  }
  ui.startLoading();
  return config;
});

function translateMessage(msg: string | undefined): string {
  if (!msg) return "Ocurrió un error inesperado.";
  const text = msg.toLowerCase();
  if (text.includes("not authenticated")) return "No autenticado";
  if (text.includes("could not validate credentials")) return "No se pudieron validar las credenciales";
  if (text.includes("inactive user")) return "Usuario inactivo";
  if (text.includes("forbidden") || text.includes("permission")) return "Sin permisos para esta acción";
  if (text.includes("not found")) return "No encontrado";
  if (text.includes("already exists") || text.includes("duplicate")) return "Ya existe un registro con esos datos";
  if (text.includes("field required")) return "Falta completar un campo requerido";
  if (text.includes("invalid") && text.includes("credentials")) return "Credenciales inválidas";
  return msg;
}

api.interceptors.response.use(
  (response) => {
    const ui = useUiStore();
    ui.stopLoading();
    return response;
  },
  (error) => {
    const ui = useUiStore();
    ui.stopLoading();
    const toast = useToastStore();
    const status = error.response?.status;
    const detail = error.response?.data?.detail;
    const rawMessage =
      (typeof detail === "string" && detail) || (Array.isArray(detail) && detail[0]?.msg) || error.response?.data?.message || error.message;
    const message = translateMessage(rawMessage);

    if (status === 401) {
      toast.warning(message || "No autenticado");
    } else if (status === 403) {
      toast.warning(message || "Sin permisos");
    } else {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export function useApi() {
  return api;
}
