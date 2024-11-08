<template>
    <div v-if="currentQuiz">
        <!-- Импровизация быстрая -->
        <button @click="sendLink">Ссылка на квиз</button>
        <h1 class="text-2xl font-bold mb-4">Edit Quiz</h1>

        <QuizInfo />

        <h2 class="text-xl font-semibold mt-6">Questions</h2>
        <QuestionsList
            @edit="openQuestionEditor"
            @create="openQuestionEditor"
        />

        <h2 class="text-xl font-semibold mt-6">Outcomes</h2>
        <OutcomesList @edit="openOutcomeEditor" @create="openOutcomeEditor" />

        <QuestionEditor
            v-if="isQuestionEditorOpen"
            :question="selectedQuestion"
            @close="closeQuestionEditor"
        />

        <OutcomeEditor
            v-if="isOutcomeEditorOpen"
            :outcome="selectedOutcome"
            @close="closeOutcomeEditor"
        />
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

const isQuestionEditorOpen = ref(false);
const isOutcomeEditorOpen = ref(false);
const selectedQuestion = ref(null);
const selectedOutcome = ref(null);

const debouncedSaveQuiz = debounce(() => {
    quizStore.saveQuiz(initDataUnsafe?.user?.id ?? 404);
}, 1000);

const openQuestionEditor = (question = null) => {
    selectedQuestion.value = question || {
        title: '',
        description: '',
        options: [],
        type: 'single-choice',
        image_url: '',
    };
    isQuestionEditorOpen.value = true;
};

const closeQuestionEditor = () => {
    isQuestionEditorOpen.value = false;
    selectedQuestion.value = null;
};

const openOutcomeEditor = (outcome = null) => {
    selectedOutcome.value = outcome || {
        text: '',
        min_percentage: 0,
        image_url: '',
    };
    isOutcomeEditorOpen.value = true;
};

const closeOutcomeEditor = () => {
    isOutcomeEditorOpen.value = false;
    selectedOutcome.value = null;
};

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
