import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ContentView from "../views/ContentView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    Component: HomeView,
  },
  {
    path: "/content/:slug", //slug matching the slug from backend
    name: "content-deatail",
    Component: ContentView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
