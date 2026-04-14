<template>
    <div class="home-container">
        <h1>ItalPrep IT: Civic & Safety</h1>
        <div v-if="loading">Loading modules...</div>
        <div v-else class="grid">
            <div v-for="module in modules" :key="module._id" class="module-card">
                <h3>{{ module.title }}</h3>
                <p>{{ module.category }}</p>
                <router-link :to="'/content/' + module.slug">Start Learning</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const modules = ref([]);
const loading = ref(true);

onMounted(async () => {
    try {
        const response = await api.getModules();
        modules.value = response.data;
    } catch (error) {
        console.error("Error fetching modules:", error);
    } finally {
        loading.value = false;
    }
})
</script>

<style scoped>
.home-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 40px 20px;
}

h1 {
    color: #2c3e50;
    text-align: center;
    margin-bottom: 40px;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
}

.module-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s, box-shadow 0.2s;
    border: 1px solid #eee;
    display: flex;
    flex-direction: column;
}

.module-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.category-tag {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #42b983;
    font-weight: bold;
    margin-bottom: 10px;
}

.learn-btn {
    margin-top: auto;
    text-align: center;
    background: #2c3e50;
    color: white;
    text-decoration: none;
    padding: 10px;
    border-radius: 6px;
    font-weight: bold;
}

.learn-btn:hover {
    background: #42b983;
}
</style>