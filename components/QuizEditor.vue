<template>
    <div class="quiz-editor rounded-xl pb-16">
        <!-- Редактор текущего элемента -->
        <ElementEditor :element="currentElement" @delete="deleteElement" />

        <!-- Навигационная панель -->
        <div class="navigation-bar">
            <button @click="prevElement">
                <span v-if="!isFirstElement">⬅️</span>
            </button>
            <button @click="toggleGridView">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    class="text-black"
                    viewBox="0 0 16 16"
                >
                    <path
                        d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z"
                    />
                </svg>
            </button>
            <button @click="nextElement">
                <span v-if="!isLastElement">➡️</span>
                <span v-else>➕</span>
            </button>
        </div>

        <!-- Модальное окно для сеточного обзора -->
        <GridView
            v-if="showGrid"
            :elements="currentQuiz.elements"
            @close="toggleGridView"
            @selectElement="jumpToElement"
        />

        <!-- <div class="outcomes-section">
            <h2>Outcomes</h2>
            <OutcomeBar :outcomes="currentQuiz.outcomes" />
        </div> -->
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuizStore } from '~/stores/quizStore';
import ElementEditor from '~/components/ElementEditor.vue';
import GridView from '~/components/GridView.vue';
import { useRoute, useRouter } from 'vue-router';

const quizStore = useQuizStore();
const route = useRoute();
const router = useRouter();

const showGrid = ref(false);
const currentIndex = ref(0);

const { currentQuiz } = storeToRefs(quizStore);

// Получаем текущий элемент квиза
const currentElement = computed(
    () => currentQuiz.value.elements[currentIndex.value]
);

// Определяем, является ли текущий элемент последним
const isLastElement = computed(
    () => currentIndex.value === currentQuiz.value.elements.length - 1
);
const isFirstElement = computed(() => currentIndex.value === 0);

// Загружаем квиз при монтировании компонента
// onMounted(async () => {
//     const quizId = route.params.id;
//     await quizStore.fetchQuiz(quizId); // Предполагается, что `fetchQuiz` загружает квиз в `currentQuiz`
// });

async function nextElement() {
    if (currentIndex.value < currentQuiz.value.elements.length - 1) {
        currentIndex.value++;
    } else {
        addElement();
    }
    await updateTextareas();
}

async function prevElement() {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    }
    await updateTextareas();
}

function addElement() {
    quizStore.addElement({
        text: 'Example',
        type: 'single-choice',
        options: [],
    });
    currentIndex.value = currentQuiz.value.elements.length - 1;
}

function deleteElement() {
    quizStore.deleteElement(currentIndex.value);
    currentIndex.value = Math.max(0, currentIndex.value - 1);
}

function toggleGridView() {
    showGrid.value = !showGrid.value;
}

function jumpToElement(index) {
    currentIndex.value = index;
    showGrid.value = false;
}
</script>

<style>
.navigation-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-around;
    padding: 1rem;
    background-color: #f0f0f0;
    border-top: 1px solid #ddd;
}

.quiz-editor {
    display: flex;
    flex-direction: column;
    /* background-color: var(--tg-theme-section-bg-dcolor); */
}
</style>
