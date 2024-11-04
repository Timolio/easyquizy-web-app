<template>
    <div class="flex flex-col h-screen p-5 box-border">
        <div v-if="currentView === 'quiz-info'">
            <h2 class="text-xl font-bold mb-4">Edit Quiz Info</h2>
            <input
                v-model="quiz.title"
                placeholder="Quiz Title"
                class="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <textarea
                v-model="quiz.description"
                placeholder="Quiz Description"
                class="w-full p-2 border border-gray-300 rounded"
            ></textarea>
        </div>

        <ElementEditor
            v-else-if="currentView === 'element'"
            :element="currentElement"
            @delete="deleteElement"
        />

        <OutcomeEditor
            v-else-if="currentView === 'outcomes'"
            :outcomes="quiz.outcomes"
            @update="updateOutcomes"
        />

        <div
            class="fixed bottom-0 left-0 right-0 flex justify-around p-4 bg-gray-100 border-t border-gray-300"
        >
            <button
                v-if="!isFirstElement"
                @click="prevElement"
                class="text-lg px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
                ⬅️
            </button>
            <button
                @click="toggleGridView"
                class="text-lg px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
                🔲
            </button>
            <button
                @click="isLastElement ? addElement() : nextElement()"
                class="text-lg px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
                <span v-if="isLastElement">➕</span>
                <span v-else>➡️</span>
            </button>
        </div>

        <GridView
            v-if="showGrid"
            :quiz="quiz"
            @close="toggleGridView"
            @selectElement="jumpToElement"
            @updateOrder="updateElementOrder"
            @openQuizInfo="openQuizInfo"
            @openOutcomes="openOutcomes"
        />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ElementEditor from '~/components/ElementEditor.vue';
import GridView from '~/components/GridView.vue';
import OutcomeEditor from '~/components/OutcomeEditor.vue';

const props = defineProps({
    quiz: {
        type: Object,
        required: true,
    },
});

const currentIndex = ref(0);
const currentView = ref('element');
const showGrid = ref(false);

const currentElement = computed(() => props.quiz.elements[currentIndex.value]);
const isFirstElement = computed(() => currentIndex.value === 0);
const isLastElement = computed(
    () => currentIndex.value === props.quiz.elements.length - 1
);

function nextElement() {
    if (currentIndex.value < props.quiz.elements.length - 1) {
        currentIndex.value++;
    }
}

function prevElement() {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    }
}

function addElement() {
    props.quiz.elements.push({
        title: '',
        description: '',
        type: 'single-choice',
        options: [],
    });
    currentIndex.value = props.quiz.elements.length - 1;
}

function deleteElement() {
    props.quiz.elements.splice(currentIndex.value, 1);
    currentIndex.value = Math.max(0, currentIndex.value - 1);
}

function toggleGridView() {
    showGrid.value = !showGrid.value;
}

// Навигация по элементам в GridView
function jumpToElement(index) {
    currentIndex.value = index;
    currentView.value = 'element';
    showGrid.value = false;
}

function openQuizInfo() {
    currentView.value = 'quiz-info';
    showGrid.value = false;
}

function openOutcomes() {
    currentView.value = 'outcomes';
    showGrid.value = false;
}

function updateOutcomes(updatedOutcomes) {
    props.quiz.outcomes = [...updatedOutcomes];
}

// Обновление порядка элементов при перетаскивании
function updateElementOrder(newOrder) {
    props.quiz.elements = [...newOrder];
}
</script>
