import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ContentView from "../views/ContentView.vue";

const routes = [
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

export default router;
