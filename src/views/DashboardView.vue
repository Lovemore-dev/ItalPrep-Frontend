<template>
  <main class="section">
    <div class="container">
      <div class="section-heading">
        <span class="badge">{{ user?.proficiency || "Learner" }} learner</span>
        <h1>Welcome back, {{ user?.fullname }}.</h1>
        <p>Choose a module and keep building your confidence one focused session at a time.</p>
      </div>
      <div v-if="loading" class="module-grid"><div v-for="item in 3" :key="item" class="module-card">Loading module...</div></div>
      <div v-else-if="modules.length" class="module-grid">
        <article v-for="module in modules" :key="module._id" class="module-card">
          <span class="badge">{{ module.category }}</span>
          <h3>{{ module.title }}</h3>
          <p>{{ module.description || "Build practical vocabulary for your next conversation." }}</p>
          <div class="module-footer"><span class="text-link">Focused practice</span><router-link class="text-link" :to="'/content/' + module.slug">Start learning →</router-link></div>
        </article>
      </div>
      <p v-else class="feature-card">No learning modules are available yet.</p>

      <section class="learner-story-form feature-card">
        <span class="badge">Share your progress</span>
        <h2>Tell us about your experience</h2>
        <p>Your story will only appear on the public landing page after an administrator reviews and approves it.</p>
        <form @submit.prevent="submitStory">
          <textarea v-model="quote" maxlength="500" required placeholder="What has ItalPrep helped you do?"></textarea>
          <button class="button button-primary" type="submit" :disabled="submitting">{{ submitting ? "Submitting..." : "Submit my story" }}</button>
        </form>
        <p v-if="message" class="success">{{ message }}</p>
        <p v-if="error" class="error">{{ error }}</p>
      </section>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api from "../services/api";

const user = JSON.parse(localStorage.getItem("italprep_user") || "null");
const modules = ref([]);
const loading = ref(true);
const quote = ref("");
const submitting = ref(false);
const message = ref("");
const error = ref("");

const submitStory = async () => {
  submitting.value = true;
  message.value = "";
  error.value = "";
  try {
    await api.submitTestimonial(quote.value);
    quote.value = "";
    message.value = "Thanks — your story is waiting for admin approval.";
  } catch (err) {
    error.value = err.response?.data?.message || "Unable to submit your story";
  } finally {
    submitting.value = false;
  }
};

onMounted(async () => {
  try { modules.value = (await api.getModules()).data; }
  catch (err) { error.value = "Unable to load modules"; }
  finally { loading.value = false; }
});
</script>

<style scoped>
.learner-story-form { max-width: 680px; margin-top: 72px; }
.learner-story-form h2 { margin: 16px 0 8px; }
.learner-story-form p { color: var(--muted); line-height: 1.6; }
.learner-story-form form { display: grid; gap: 12px; margin-top: 20px; }
.learner-story-form textarea { min-height: 110px; padding: 12px; resize: vertical; color: var(--text); background: var(--surface-raised); border: 1px solid var(--border); border-radius: 8px; }
.success { color: var(--success) !important; }
.error { color: #fca5a5 !important; }
</style>
