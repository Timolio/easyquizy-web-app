<template>
    <div v-if="currentQuiz" class="edit-quiz-page flex flex-col h-full gap-2">
        <!-- Заголовок квиза -->
        <div class="header-container rounded-xl flex flex-row">
            <h1 class="text-sm font-semibold ms-2 tg-hint">
                {{ currentQuiz.title || 'Edit Quiz' }}
            </h1>
            <p class="text-sm" v-if="saving">Cохранение...</p>
        </div>
        <!-- Основной компонент редактора квиза -->
        <QuizEditor class="grow" v-if="currentQuiz.elements.length > 0" />
    </div>
</template>

<script setup>
import { useQuizStore } from '~/stores/quizStore';
import QuizEditor from '~/components/QuizEditor.vue';
import { debounce } from 'lodash';
import { useWebApp } from 'vue-tg';

const route = useRoute();
const quizStore = useQuizStore();
const { initDataUnsafe } = useWebApp();

const { fetchQuizById, saveQuiz } = quizStore;
const { currentQuiz, saving } = storeToRefs(quizStore);

// Загрузка квиза при монтировании страницы
// onMounted(async () => {
//     const quizId = route.params.id;
//     await quizStore.fetchQuiz(quizId);
// });

const debouncedSaveQuiz = debounce(saveQuiz, 1000);

onMounted(async () => {
    await fetchQuizById(route.params.quizId, initDataUnsafe?.user?.id ?? 404);
    watch(currentQuiz.value, debouncedSaveQuiz, { deep: true });
});
</script>

<style scoped>
/* h1 {
    color: var(--tg-theme-text-color);
} */

/* .header-container {
    background-color: var(--tg-theme-section-bg-dcolor);
} */
</style>
