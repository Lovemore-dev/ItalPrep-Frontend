import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ContentView from "../views/ContentView.vue";
import AdminView from "../views/AdminView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import DashboardView from "../views/DashboardView.vue";

const routes = [
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    meta: { requiresLearner: true },
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminView,
    meta: { requiresAdmin: true },
  },
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/content/:slug", //slug matching the slug from backend
    name: "content-detail",
    component: ContentView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const user = JSON.parse(localStorage.getItem("italprep_user") || "null");
  if (to.meta.requiresAdmin && (!localStorage.getItem("italprep_token") || user?.role !== "admin")) {
    return { name: "login" };
  }
  if (to.meta.requiresLearner && (!localStorage.getItem("italprep_token") || user?.role === "admin")) {
    return { name: "login" };
  }
});

export default router;
