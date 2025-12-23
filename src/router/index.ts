import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import CatalogView from "@/views/CatalogView.vue";
import ProductView from "@/views/ProductView.vue";
import CartView from "@/views/CartView.vue";
import CheckoutView from "@/views/CheckoutView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import OrdersView from "@/views/OrdersView.vue";
import OrderDetailView from "@/views/OrderDetailView.vue";
import AdminView from "@/views/admin/AdminView.vue";
import ProfileView from "@/views/ProfileView.vue";

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 };
  },
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/catalog", name: "catalog", component: CatalogView },
    { path: "/product/:id", name: "product", component: ProductView, props: true },
    { path: "/cart", name: "cart", component: CartView },
    { path: "/checkout", name: "checkout", component: CheckoutView },
    { path: "/login", name: "login", component: LoginView },
    { path: "/register", name: "register", component: RegisterView },
    { path: "/profile", name: "profile", component: ProfileView },
    { path: "/orders", name: "orders", component: OrdersView },
    { path: "/orders/:id", name: "order", component: OrderDetailView, props: true },
    { path: "/admin", name: "admin", component: AdminView },
  ],
});

export default router;
