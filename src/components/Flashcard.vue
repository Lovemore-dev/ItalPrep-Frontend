<template>
    <div class="flashcard" @click="isFlipped = !isFlipped" :class="{ flipped: isFlipped }">
        <div class="card-inner">
            <div class="card-front">
                <span class="lang-label">IT</span>
                <h3>{{ term.label_it }}</h3>
            </div>
            <div class="card-back">
                <span class="lang-label">EN</span>
                <h3>{{ term.label_en }}</h3>
                <p v-if="term.extra_info">{{ term.extra_info }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
    term: {
        type: Object,
        required: true
    }
})

const isFlipped = ref(false)
</script>

<style scoped>
.flashcard {
    perspective: 1000px;
    height: 180px;
    cursor: pointer;
}

.card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
}

.flashcard.flipped .card-inner {
    transform: rotateY(180deg);
}

.card-front,
.card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    border: 2px solid #eee;
    padding: 20px;
}

.card-front {
    background: white;
}

.card-back {
    background: #42b983;
    color: white;
    transform: rotateY(180deg);
}

.lang-label {
    font-size: 0.6rem;
    font-weight: bold;
    opacity: 0.5;
    margin-bottom: 10px;
}
</style>