<template>
  <main>
    <section class="hero">
      <div class="container hero-content">
        <span class="eyebrow">✦ Built for focused interview prep</span>
        <h1>Speak with confidence.<br><span class="gradient-text">Build your future.</span></h1>
        <p>Master the Italian vocabulary, civic knowledge, and safety concepts that help you thrive in modern technical teams.</p>
        <a class="button button-primary" href="#modules">Explore the modules <span aria-hidden="true">→</span></a>
      </div>
    </section>

    <section id="how-it-works" class="section">
      <div class="container">
        <div class="section-heading fade-in">
          <span class="badge">A better way to learn</span>
          <h2>Practice that feels like progress.</h2>
          <p>Small, repeatable sessions designed to turn unfamiliar terms into confident answers.</p>
        </div>
        <div class="feature-grid">
          <article v-for="feature in features" :key="feature.title" class="feature-card fade-in">
            <div class="feature-icon" aria-hidden="true">{{ feature.icon }}</div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="modules" class="section">
      <div class="container">
        <div class="section-heading fade-in">
          <span class="badge">Your curriculum</span>
          <h2>Everything you need, in one place.</h2>
          <p>Choose a module and flip through focused flashcards at your own pace.</p>
        </div>
        <div v-if="loading" class="module-grid"><div v-for="item in 3" :key="item" class="module-card">Loading module...</div></div>
        <div v-else-if="modules.length" class="module-grid">
          <article v-for="module in modules" :key="module._id" class="module-card">
            <span class="badge">{{ module.category }}</span>
            <h3>{{ module.title }}</h3>
            <p>{{ module.description || "Build practical vocabulary for your next conversation." }}</p>
            <div class="module-footer"><span class="text-link">{{ module.itemCount || "Focused"}}
              {{ module.itemCount ? "terms" : "practice" }}</span><router-link class="text-link" :to="'/content/' + module.slug">Start learning →</router-link></div>
          </article>
        </div>
        <p v-else-if="error" class="feature-card error-state">We couldn't load the modules. Check that the API is running, then refresh the page.</p>
        <p v-else class="feature-card">No modules are available yet. Check back soon.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="stats fade-in">
          <div class="stat"><strong>7+</strong><span>Curated learning paths</span></div>
          <div class="stat"><strong>100%</strong><span>Focused on practical language</span></div>
          <div class="stat"><strong>∞</strong><span>Practice at your own pace</span></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-heading fade-in"><span class="badge">Learner stories</span><h2>Calm preparation. Stronger interviews.</h2></div>
        <div v-if="testimonials.length" class="testimonial-grid">
          <article v-for="testimonial in testimonials" :key="testimonial.id" class="testimonial">
            <blockquote>“{{ testimonial.quote }}”</blockquote>
            <div class="person"><span class="avatar">{{ testimonial.initials }}</span><span><strong>{{ testimonial.name }}</strong><span>{{ testimonial.proficiency }} learner</span></span></div>
          </article>
        </div>
        <p v-else class="feature-card">Learner stories will appear here as our community shares and approves them.</p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api from "../services/api";

const modules = ref([]);
const loading = ref(true);
const error = ref(false);
const features = [
  { icon: "◈", title: "Learn in context", description: "Connect every Italian term to real software, workplace, and civic situations." },
  { icon: "↗", title: "Flip and recall", description: "Use active recall with simple flashcards that make every session count." },
  { icon: "⌁", title: "Move at your pace", description: "Build a steady routine with concise modules that fit around your day." },
];
const testimonials = ref([]);
onMounted(async () => {
  try {
    modules.value = (await api.getModules()).data;
  } catch (fetchError) { error.value = true; console.error("Error fetching modules:", fetchError); }
  try {
    testimonials.value = (await api.getTestimonials()).data;
  } catch (testimonialError) { console.error("Error fetching testimonials:", testimonialError); }
  finally {
    loading.value = false;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")), { threshold: .12 });
    document.querySelectorAll(".fade-in").forEach((element) => observer.observe(element));
  }
});
</script>
