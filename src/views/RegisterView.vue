<template>
  <main class="admin-panel auth-panel">
    <span class="badge">Start learning</span>
    <h1>Create your learner account</h1>
    <p class="auth-subtitle">Choose your current Italian level so your practice starts at the right pace.</p>
    <form class="editor" @submit.prevent="register">
      <label>Full name <input v-model="form.fullname" required autocomplete="name" /></label>
      <label>Username <input v-model="form.username" required pattern="[a-zA-Z0-9]+" autocomplete="username" /></label>
      <label>Password <input v-model="form.password" type="password" minlength="6" required autocomplete="new-password" /></label>
      <label>Italian proficiency level
        <select v-model="form.proficiency" required>
          <option v-for="level in levels" :key="level.value" :value="level.value">{{ level.value }} — {{ level.label }}</option>
        </select>
      </label>
      <p class="level-help">{{ selectedLevel.label }}: {{ selectedLevel.description }}</p>
      <p v-if="error" class="error">{{ error }}</p>
      <button type="submit" :disabled="loading">{{ loading ? "Creating account..." : "Create learner account" }}</button>
    </form>
    <p class="auth-switch">Already registered? <router-link to="/login">Sign in</router-link></p>
  </main>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();
const levels = [
  { value: "A1", label: "Beginner", description: "You are starting with basic words and phrases." },
  { value: "A2", label: "Elementary", description: "You can communicate in familiar everyday situations." },
  { value: "B1", label: "Intermediate", description: "You can handle many practical conversations independently." },
  { value: "B2", label: "Upper-intermediate", description: "You can discuss technical topics with growing confidence." },
  { value: "C1", label: "Advanced", description: "You can communicate fluently in professional contexts." },
  { value: "C2", label: "Proficient", description: "You have near-native comprehension and expression." },
];
const form = reactive({ fullname: "", username: "", password: "", proficiency: "A1" });
const selectedLevel = computed(() => levels.find((level) => level.value === form.proficiency) || levels[0]);
const error = ref("");
const loading = ref(false);

const register = async () => {
  loading.value = true;
  error.value = "";
  try {
    await api.register(form);
    const { data } = await api.login({ username: form.username, password: form.password });
    localStorage.setItem("italprep_token", data.token);
    localStorage.setItem("italprep_user", JSON.stringify(data.user));
    window.dispatchEvent(new Event("auth-changed"));
    router.push("/dashboard");
  } catch (err) {
    error.value = err.response?.data?.message || "Unable to create account";
  } finally {
    loading.value = false;
  }
};
</script>
