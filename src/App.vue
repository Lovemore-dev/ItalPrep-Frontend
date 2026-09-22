<template>
  <header class="site-nav">
    <div class="container nav-inner">
      <router-link class="brand" to="/">
        <span class="brand-mark">IP</span>
        <span>ItalPrep</span>
      </router-link>
      <nav class="nav-links" aria-label="Primary navigation">
        <a class="nav-link" href="/#modules">Modules</a>
        <a class="nav-link" href="/#how-it-works">How it works</a>
        <router-link v-if="isAdmin" class="nav-link admin-link" to="/admin">Admin</router-link>
      </nav>
      <div class="nav-actions">
        <button class="theme-toggle" type="button" :aria-label="isLight ? 'Use dark theme' : 'Use light theme'" @click="toggleTheme">{{ isLight ? '☾' : '☼' }}</button>
        <span v-if="user" class="nav-user">{{ user.fullname }}<small v-if="!isAdmin">{{ user.proficiency }}</small></span>
        <button v-if="user" class="button button-secondary" type="button" @click="logout">Sign out</button>
        <router-link v-else class="button button-primary" to="/login">Sign in</router-link>
      </div>
    </div>
  </header>
  <router-view />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isAdmin = ref(false);
const user = ref(null);
const isLight = ref(false);
const syncUser = () => {
  const storedUser = JSON.parse(localStorage.getItem("italprep_user") || "null");
  user.value = storedUser;
  isAdmin.value = Boolean(localStorage.getItem("italprep_token") && user.value?.role === "admin");
};
const handleAuthChange = () => syncUser();
const toggleTheme = () => {
  isLight.value = !isLight.value;
  document.documentElement.classList.toggle("light", isLight.value);
  localStorage.setItem("italprep_theme", isLight.value ? "light" : "dark");
};
const logout = () => {
  localStorage.removeItem("italprep_token");
  localStorage.removeItem("italprep_user");
  syncUser();
  window.dispatchEvent(new Event("auth-changed"));
  router.push("/");
};
onMounted(() => {
  isLight.value = localStorage.getItem("italprep_theme") === "light";
  document.documentElement.classList.toggle("light", isLight.value);
  syncUser();
  window.addEventListener("auth-changed", handleAuthChange);
});
</script>
