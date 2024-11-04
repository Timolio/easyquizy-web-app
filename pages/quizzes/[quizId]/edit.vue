<template>
    <div v-if="currentQuiz">
        <QuizEditor :quiz="currentQuiz" />
    </div>
    <div v-else>
        <p>Loading or access denied... {{ currentQuiz }}</p>
    </div>
</template>

<script setup>
import { debounce } from 'lodash';
import { useRoute } from 'vue-router';
const { useWebApp } = await import('vue-tg');

const quizStore = useQuizStore();
const { initDataUnsafe } = useWebApp();

const route = useRoute();
const { currentQuiz } = storeToRefs(quizStore);

const debouncedSaveQuiz = debounce(() => {
    quizStore.saveQuiz(initDataUnsafe?.user?.id ?? 404);
}, 1000);

onMounted(async () => {
    const quizId = route.params.quizId;
    await quizStore.fetchQuizById(quizId, initDataUnsafe?.user?.id ?? 404);
});

watch(
    () => currentQuiz.value,
    () => {
        debouncedSaveQuiz();
    },
    { deep: true }
);
</script>
