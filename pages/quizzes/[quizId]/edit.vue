<template>
    <!-- Импровизация быстрая -->
    <button @click="sendLink">Ссылка на квиз</button>
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
const { useWebApp, useWebAppNavigation } = await import('vue-tg');

const quizStore = useQuizStore();
const { initDataUnsafe } = useWebApp();
const { openTelegramLink } = useWebAppNavigation();

const route = useRoute();
const { currentQuiz } = storeToRefs(quizStore);

const debouncedSaveQuiz = debounce(() => {
    quizStore.saveQuiz(initDataUnsafe?.user?.id ?? 404);
}, 1000);

// Импровизация быстрая
const sendLink = async () => {
    const link = `https://t.me/idmikuji_bot/start?startapp=${currentQuiz.value._id}`;
    console.log(link);
    openTelegramLink(`https://t.me/share/url?url=${link}&text=@idmikuji_bot`);
};

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
