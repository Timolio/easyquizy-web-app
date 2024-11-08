<template>
    <div>
        <button
            @click="$emit('create')"
            class="bg-green-500 text-white px-4 py-2 rounded-md mb-4"
        >
            Create New Question
        </button>
        <VueDraggableNext v-model="currentQuiz.elements" :animation="200">
            <div
                v-for="(question, index) in currentQuiz.elements"
                :key="index"
                class="flex justify-between items-center mb-2 p-2 border rounded-md"
            >
                <span>{{ question.title }}</span>
                <button @click="$emit('edit', question)" class="text-blue-500">
                    Edit
                </button>
            </div>
        </VueDraggableNext>
    </div>
</template>

<script setup>
import { VueDraggableNext } from 'vue-draggable-next';

const { currentQuiz } = useQuizStore();
</script>
