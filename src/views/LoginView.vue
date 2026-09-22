<template>
  <main class="admin-panel auth-panel">
    <span class="badge">Welcome back</span>
    <h1>Sign in to ItalPrep</h1>
    <p class="auth-subtitle">Continue your focused interview preparation.</p>
    <form class="editor" @submit.prevent="login">
      <label>Username <input v-model="form.username" required autocomplete="username" /></label>
      <label>Password <input v-model="form.password" type="password" required autocomplete="current-password" /></label>
      <p v-if="error" class="error">{{ error }}</p>
      <button type="submit" :disabled="loading">{{ loading ? "Signing in..." : "Sign in" }}</button>
    </form>
    <p class="auth-switch">New learner? <router-link to="/register">Create an account</router-link></p>
  </main>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();
const form = reactive({ username: "", password: "" });
const error = ref("");
const loading = ref(false);

const login = async () => {
  loading.value = true;
  error.value = "";
  try {
    const { data } = await api.login(form);
    localStorage.setItem("italprep_token", data.token);
    localStorage.setItem("italprep_user", JSON.stringify(data.user));
    window.dispatchEvent(new Event("auth-changed"));
    router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
  } catch (err) {
    error.value = err.response?.data?.message || "Unable to sign in";
  } finally {
    loading.value = false;
  }
};
</script>
