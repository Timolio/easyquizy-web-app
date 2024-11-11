<template>
    <div class="quiz grow" v-if="quiz">
        <!-- Стартовый экран -->

        <div v-if="!hasStarted" class="start-screen">
            <img class="mb-5" :src="quiz.image_url" />
            <div class="flex flex-col justify-center items-center px-5 gap-4">
                <h1 class="text-2xl font-semibold text-center">
                    {{ quiz.title }}
                </h1>

                <button
                    @click="startQuiz"
                    class="tg__button px-6 py-3 font-bold text-lg rounded"
                >
                    Начать
                </button>
                <p class="text-lg">{{ quiz.description }}</p>
            </div>
        </div>

        <!-- Экран прохождения квиза -->
        <div
            v-else-if="!isQuizCompleted"
            class="quiz-container flex flex-col h-full justify-between items-center pt-6"
        >
            <!-- Индикатор прогресса -->
            <div class="w-full mb-6 px-8">
                <p class="text-xl font-bold tracking-widest">
                    {{ currentIndex + 1 }}/{{ totalQuestions }}
                </p>
            </div>

            <div
                v-if="currentQuestion"
                class="question flex flex-col gap-4 px-8 w-full"
            >
                <img
                    v-if="currentQuestion?.image_url"
                    class="mb-4"
                    :src="currentQuestion.image_url"
                />
                <h2 class="text-2xl font-bold mb-4">
                    {{ currentQuestion.title }}
                </h2>
                <p v-if="currentQuestion?.description" class="mb-4">
                    {{ currentQuestion.description }}
                </p>

                <!-- Single-choice question -->
                <div
                    class="flex flex-col gap-8"
                    v-if="currentQuestion.type === 'single-choice'"
                >
                    <label
                        v-for="(option, index) in currentQuestion.options"
                        :key="index"
                        class="flex flex-row gap-7"
                    >
                        <input
                            type="radio"
                            :id="'single-' + currentIndex + '-' + index"
                            :name="'option-' + currentIndex"
                            :value="index"
                            v-model="userAnswers[currentIndex]"
                            class="mr-2"
                        />
                        <label :for="'single-' + currentIndex + '-' + index">{{
                            option.text
                        }}</label>
                    </label>
                </div>

                <!-- Multiple-choice question -->
                <div v-if="currentQuestion.type === 'multiple-choice'">
                    <label
                        v-for="(option, index) in currentQuestion.options"
                        :key="index"
                        class="block mb-2"
                    >
                        <input
                            type="checkbox"
                            :id="'multi-' + currentIndex + '-' + index"
                            :value="index"
                            v-model="userAnswers[currentIndex]"
                            class="mr-2"
                        />
                        <label :for="'multi-' + currentIndex + '-' + index">{{
                            option.text
                        }}</label>
                    </label>
                </div>

                <!-- Text-answer question -->
                <div v-if="currentQuestion.type === 'text-answer'" class="mb-4">
                    <textarea
                        v-model="userAnswers[currentIndex]"
                        placeholder="Your answer"
                        class="w-full p-2 border border-gray-300 rounded"
                    ></textarea>
                </div>
            </div>
            <div class="w-full">
                <!-- Navigation buttons -->
                <div class="flex justify-between p-6 flex flex-row gap-3">
                    <button
                        v-if="currentIndex > 0"
                        @click="prevQuestion"
                        class="px-6 py-2 font-bold text-lg rounded tg__button"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            class="bi bi-arrow-left"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                            />
                        </svg>
                    </button>
                    <button
                        @click="nextQuestion"
                        v-if="isAnswerSelected"
                        class="px-4 grow py-2 rounded font-bold text-lg tg__button2"
                    >
                        {{ isLastQuestion ? 'Завершить' : 'Далее' }}
                    </button>
                </div>
                <!-- Прогресс-бар -->
                <div class="progress-bar">
                    <div
                        class="progress"
                        :style="{ width: progressPercentage + '%' }"
                    ></div>
                </div>
            </div>
        </div>

        <!-- Quiz result -->
        <div v-else class="h-full result flex flex-col">
            <img class="mb-4" :src="outcome.image_url" />
            <div class="flex grow flex-col items-center gap-4 px-5">
                <h2 class="text-2xl font-bold">Итог</h2>
                <p class="text-lg">{{ outcome.text }}</p>
                <p class="mt-4 tg__hint">Твой счёт: {{ finalScore }}%</p>
            </div>
        </div>
    </div>

    <div v-else class="text-center p-5">
        <p>Loading quiz...</p>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
const { useWebApp, useWebAppTheme } = await import('vue-tg');

const { initDataUnsafe } = useWebApp();
const { setHeaderColor, themeParams } = useWebAppTheme();
const route = useRoute();
const quizStore = useQuizStore();
const { currentQuiz: quiz } = storeToRefs(quizStore);

const hasStarted = ref(false);
const currentIndex = ref(0);
const userAnswers = ref({});
const isQuizCompleted = ref(false);
const finalScore = ref(0);
const outcome = ref(null);

// Load quiz on mount
onMounted(async () => {
    const root = document.documentElement;
    const style = window.getComputedStyle(root);
    setHeaderColor(style.getPropertyValue('--tg-theme-button-ddcolor'));
    // setHeaderColor(adjust(themeParams.value.button_color, -50));
    const quizId = route.params.quizId;
    await quizStore.fetchQuizById(quizId, initDataUnsafe?.user?.id ?? 404);
});

// Количество вопросов
const totalQuestions = computed(() => quiz.value?.elements.length || 0);

// Computed properties for current question and last question check
const currentQuestion = computed(
    () => quiz.value?.elements[currentIndex.value]
);
const isLastQuestion = computed(
    () => currentIndex.value === quiz.value?.elements.length - 1
);

// Процент прогресса
const progressPercentage = computed(
    () => (currentIndex.value / totalQuestions.value) * 100
);

// Проверка, выбран ли ответ на текущий вопрос
const isAnswerSelected = computed(() => {
    const answer = userAnswers.value[currentIndex.value];
    if (currentQuestion.value.type === 'single-choice') {
        return answer !== undefined;
    } else if (currentQuestion.value.type === 'multiple-choice') {
        return answer && answer.length > 0;
    } else if (currentQuestion.value.type === 'text-answer') {
        return answer && answer.trim().length > 0;
    }
    return false;
});

function startQuiz() {
    hasStarted.value = true;
}

// Initialize array for multiple-choice answers
function initializeAnswer(index) {
    if (
        !userAnswers.value[index] &&
        currentQuestion.value.type === 'multiple-choice'
    ) {
        userAnswers.value[index] = [];
    }
}

// Navigate to the next question
async function nextQuestion() {
    if (isLastQuestion.value) {
        await completeQuiz();
    } else {
        currentIndex.value++;
        initializeAnswer(currentIndex.value);
    }
}

// Navigate to the previous question
function prevQuestion() {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    }
}

// Complete quiz
async function completeQuiz() {
    isQuizCompleted.value = true;
    calculateScore();
    const telegramId = initDataUnsafe?.user?.id ?? 404;

    try {
        await $fetch('/api/results', {
            method: 'POST',
            body: {
                quiz_id: quiz.value._id,
                user_id: telegramId,
                score: finalScore.value,
            },
        });
    } catch (e) {
        console.error('Failed to save quiz result:', e);
    }
}

// Calculate final score and determine outcome
function calculateScore() {
    let totalScore = 0;
    let maxScore = 0;

    quiz.value.elements.forEach((question, index) => {
        if (question.type === 'single-choice') {
            const selectedIndex = userAnswers.value[index];
            if (selectedIndex !== undefined) {
                totalScore += question.options[selectedIndex].score;
            }
            maxScore += Math.max(
                0,
                ...question.options.map(option => option.score)
            );
        } else if (question.type === 'multiple-choice') {
            const selectedIndexes = userAnswers.value[index] || [];
            totalScore += selectedIndexes.reduce(
                (sum, selectedIndex) =>
                    sum + question.options[selectedIndex].score,
                0
            );
            maxScore += question.options
                .filter(option => option.score > 0)
                .reduce((sum, option) => sum + option.score, 0);
        } else if (question.type === 'text-answer') {
            const userAnswer = (userAnswers.value[index] || '')
                .trim()
                .toLowerCase();
            const correctOption = question.options.find(
                option => option.text.trim().toLowerCase() === userAnswer
            );
            if (correctOption) {
                totalScore += correctOption.score;
            }
            maxScore += Math.max(
                0,
                ...question.options.map(option => option.score)
            );
        }
    });

    totalScore = Math.max(0, totalScore);

    finalScore.value = Math.round((totalScore / maxScore) * 100);

    outcome.value = quiz.value.outcomes
        .sort((a, b) => a.min_percentage - b.min_percentage)
        .reverse()
        .find(o => finalScore.value >= o.min_percentage);
}
</script>

<style scoped>
.quiz {
    background-color: var(--tg-theme-button-dtcolor);
    overflow-y: auto;
    max-height: 100vh;
}

.tg__button {
    background-color: var(--tg-theme-bg-tcolor);
}
.tg__button2 {
    background-color: var(--tg-theme-bg-tcolor);
}

input[type='radio'] {
    appearance: none;
    background-color: var(--tg-theme-text-color);
    margin: 0;
    font: inherit;
    color: var(--tg-theme-text-color);
    width: 1.4em;
    height: 1.4em;
    border: 0.15em solid var(--tg-theme-text-color);
    border-radius: 50%;
    transform: translateY(-0.075em);
    display: grid;
    place-content: center;
}

input[type='radio']::before {
    content: '';
    width: 1em;
    height: 1em;
    border-radius: 50%;
    transform: scale(0);
    transition: 100ms transform ease-in-out;
    box-shadow: inset 1em 1em var(--tg-theme-secondary-bg-color);
}

input[type='radio']:checked::before {
    transform: scale(1);
}

.quiz-container {
    max-width: 600px;
    margin: 0 auto;
}

/* h3,
h1,
h2,
label,
p {
    color: dimgray;
} */

.start-screen {
    max-width: 600px;
}

label {
    font-size: 1.2rem;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background-color: #e5e5e5;
    overflow: hidden;
}

.progress {
    height: 100%;
    background-color: var(--tg-theme-button-dcolor);
    transition: width 0.3s ease;
}
</style>
