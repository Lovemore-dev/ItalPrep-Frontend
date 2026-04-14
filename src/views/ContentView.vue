<template>
    <div class="content-detail">
        <router-link to="/" class="back-btn">← Back to Home</router-link>

        <div v-if="loading" class="status">Caricamento in corso... (Loading...)</div>

        <div v-else-if="module">
            <header>
                <h1>{{ module.title }}</h1>
                <span class="badge">{{ module.category }}</span>
                <p>{{ module.description }}</p>
            </header>

            <div class="items-grid">
                <Flashcard v-for="(item, index) in module.items" :key="index" :term="item" class="term-card">
                    <div class="italian">{{ item.label_it }}</div>
                    <div class="english">{{ item.label_en }}</div>
                    <p v-if="item.extra_info" class="extra">{{ item.extra_info }}</p>
                </Flashcard>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // Needed to grab the :slug from the URL
import api from '../services/api';
import Flashcard from '../components/Flashcard.vue';

const route = useRoute();
const module = ref(null);
const loading = ref(true);

onMounted(async () => {
    try {
        // We use route.params.slug to tell the backend which module we want
        const response = await api.getModuleDetails(route.params.slug);
        module.value = response.data;
    } catch (error) {
        console.error("Error loading module details:", error);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.content-detail {
    padding: 20px;
    max-width: 900px;
    margin: 0 auto;
}

.back-btn {
    display: inline-block;
    margin-bottom: 20px;
    color: #42b983;
    text-decoration: none;
}

.badge {
    background: #e2f3ec;
    color: #42b983;
    padding: 4px 12px;
    border-radius: 15px;
    font-size: 0.8rem;
    text-transform: uppercase;
}

.items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 30px;
}

.term-card {
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 12px;
    background: white;
    transition: transform 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.term-card:hover {
    transform: translateY(-5px);
}

.italian {
    font-weight: bold;
    color: #2c3e50;
    font-size: 1.25rem;
    margin-bottom: 5px;
}

.english {
    color: #666;
    font-style: italic;
    margin-bottom: 10px;
}

.extra {
    font-size: 0.85rem;
    color: #999;
    border-top: 1px solid #eee;
    padding-top: 10px;
}
</style>