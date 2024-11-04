<template>
    <div
        class="grid-view-overlay bg-black bg-opacity-70 fixed inset-0 flex flex-col items-center justify-center p-5"
    >
        <!-- Кнопка для перехода на страницу редактирования Quiz Info -->
        <div
            class="grid-item w-full max-w-md p-4 mb-4 bg-white rounded shadow-lg cursor-pointer"
            @click="openQuizInfo"
        >
            <h3 class="text-lg font-bold text-center">Quiz Info</h3>
        </div>

        <!-- Перетаскиваемые вопросы -->
        <Draggable
            v-model="quiz.elements"
            @end="handleDragEnd"
            item-key="id"
            class="grid grid-cols-3 gap-4 max-w-md w-full"
        >
            <div
                v-for="(element, index) in quiz.elements"
                class="grid-item bg-white p-4 rounded shadow cursor-pointer"
                @click="selectElement(index)"
            >
                <p class="font-semibold text-center">
                    {{ element.title || `Question ${index + 1}` }}
                </p>
            </div>
        </Draggable>

        <!-- Кнопка для перехода на страницу редактирования Outcomes -->
        <div
            class="grid-item w-full max-w-md p-4 mt-4 bg-white rounded shadow-lg cursor-pointer"
            @click="openOutcomes"
        >
            <h3 class="text-lg font-bold text-center">Edit Outcomes</h3>
        </div>

        <button
            class="close-button text-lg px-4 py-2 bg-red-500 text-white rounded mt-5"
            @click="$emit('close')"
        >
            Close
        </button>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { VueDraggableNext as Draggable } from 'vue-draggable-next';

const props = defineProps({
    quiz: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits([
    'close',
    'selectElement',
    'updateOrder',
    'openQuizInfo',
    'openOutcomes',
]);

// Перемещаем выбранный элемент
function handleDragEnd() {
    emit('updateOrder', props.quiz.elements);
}

function selectElement(index) {
    emit('selectElement', index);
}

function openQuizInfo() {
    emit('openQuizInfo');
}

function openOutcomes() {
    emit('openOutcomes');
}
</script>

<style>
.grid-view-overlay {
    z-index: 50;
}

.grid-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100px;
    cursor: pointer;
    transition: transform 0.2s;
}

.grid-item:hover {
    transform: scale(1.05);
}
</style>
