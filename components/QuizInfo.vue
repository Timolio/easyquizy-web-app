<template>
    <div class="mb-6">
        <ImageUploader class="w-full mb-2" v-model="currentQuiz.image_url" />
        <input
            v-model="currentQuiz.title"
            type="text"
            placeholder="Quiz Title"
            class="w-full border border-gray-300 rounded-md p-2 mb-2"
        />
        <textarea
            v-model="currentQuiz.description"
            placeholder="Quiz Description"
            class="w-full border border-gray-300 rounded-md p-2"
        ></textarea>
    </div>
</template>

<script setup>
const quizStore = useQuizStore();
const { currentQuiz } = storeToRefs(quizStore);
</script>
