import { defineStore } from "pinia";
import { ref } from "vue";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
  title?: string;
  duration?: number;
}

export const useToastStore = defineStore("toast", () => {
  const toasts = ref<ToastMessage[]>([]);
  let counter = 0;

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  function push(message: string, type: ToastType = "info", opts: Partial<Omit<ToastMessage, "id" | "message" | "type">> = {}) {
    const toast: ToastMessage = {
      id: ++counter,
      message,
      type,
      title: opts.title,
      duration: opts.duration ?? 4000,
    };
    toasts.value.push(toast);
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => dismiss(toast.id), toast.duration);
    }
    return toast.id;
  }

  return {
    toasts,
    dismiss,
    show: push,
    success: (message: string, opts?: Partial<Omit<ToastMessage, "id" | "message" | "type">>) => push(message, "success", opts),
    error: (message: string, opts?: Partial<Omit<ToastMessage, "id" | "message" | "type">>) => push(message, "error", opts),
    warning: (message: string, opts?: Partial<Omit<ToastMessage, "id" | "message" | "type">>) => push(message, "warning", opts),
    info: (message: string, opts?: Partial<Omit<ToastMessage, "id" | "message" | "type">>) => push(message, "info", opts),
  };
});
