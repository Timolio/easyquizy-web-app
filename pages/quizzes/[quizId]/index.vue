<template>
    <div class="quiz grow" v-if="quiz">
        <!-- Стартовый экран -->

        <div v-if="!hasStarted">
            <div
                class="flex flex-col justify-center items-center px-5 gap-4 py-5"
            >
                <div class="tg__container">
                    <div class="header">
                        <img :src="quiz.image_url" />
                        <div class="block">
                            <h2 class="text-2xl font-bold leading-relaxed">
                                <span class="">{{ quiz.title }}</span>
                            </h2>
                        </div>
                    </div>
                    <div class="block-sm flex justify-end">
                        <button
                            @click="startQuiz"
                            class="size-12 shrink-0 tg__button flex justify-center items-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="38"
                                height="38"
                                fill="currentColor"
                                class="ml-0.5"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M10.804 8 5 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <p class="tg__container block header text-xl">
                    {{ quiz.description }}
                </p>
            </div>
        </div>

        <!-- Экран прохождения квиза -->
        <div
            v-else-if="!isQuizCompleted"
            class="quiz-container flex flex-col h-full justify-between items-center"
        >
            <!-- Индикатор прогресса -->
            <div class="w-full mb-4 px-8 pt-6">
                <p class="text-xl font-bold tracking-widest">
                    <span class="tg__color">{{ currentIndex + 1 }}</span
                    >/{{ totalQuestions }}
                </p>
            </div>

            <div v-if="currentQuestion" class="px-3 w-full">
                <div class="tg__container header flex flex-col">
                    <img
                        v-if="currentQuestion?.image_url"
                        :src="currentQuestion.image_url"
                    />
                    <div class="block">
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
                                v-for="(
                                    option, index
                                ) in currentQuestion.options"
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
                                <label
                                    :for="
                                        'single-' + currentIndex + '-' + index
                                    "
                                    >{{ option.text }}</label
                                >
                            </label>
                        </div>

                        <!-- Multiple-choice question -->
                        <div v-if="currentQuestion.type === 'multiple-choice'">
                            <label
                                v-for="(
                                    option, index
                                ) in currentQuestion.options"
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
                                <label
                                    :for="'multi-' + currentIndex + '-' + index"
                                    >{{ option.text }}</label
                                >
                            </label>
                        </div>

                        <!-- Text-answer question -->
                        <div
                            v-if="currentQuestion.type === 'text-answer'"
                            class="mb-4"
                        >
                            <textarea
                                v-model="userAnswers[currentIndex]"
                                placeholder="Your answer"
                                class="w-full p-2 border border-gray-300 rounded"
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full">
                <!-- Navigation buttons -->
                <div
                    class="flex justify-between px-3 pt-3 pb-5 flex flex-row gap-3"
                >
                    <button
                        v-if="currentIndex > 0"
                        @click="prevQuestion"
                        class="px-6 py-2 font-bold text-lg tg__button2"
                    >
                        <!-- <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                            />
                        </svg> -->
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            fill="currentColor"
                            viewBox="0 0 32 32"
                        >
                            <path
                                d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z"
                                data-name="4-Arrow Left"
                            />
                        </svg>
                    </button>
                    <button
                        @click="nextQuestion"
                        v-if="isAnswerSelected"
                        class="px-4 grow py-2 font-bold text-lg tg__button3"
                    >
                        {{ isLastQuestion ? 'Завершить' : 'Далее' }}
                    </button>
                </div>
                <!-- Прогресс-бар -->
                <div class="progress-bar fixed -bottom-0.5">
                    <div
                        class="progress"
                        :style="{ width: progressPercentage + '%' }"
                    ></div>
                </div>
            </div>
        </div>

        <!-- Quiz result -->
        <div
            v-else
            class="flex flex-col justify-center items-center px-5 gap-4 py-5"
        >
            <div class="tg__container">
                <div class="header">
                    <img :src="outcome.image_url" />
                    <div class="block">
                        <h2 class="text-2xl font-bold leading-relaxed">
                            <span>{{ outcome.title }}</span>
                        </h2>
                    </div>
                </div>
                <div class="block-sm flex justify-end">
                    <!-- Кнопка для повторного прохождения квиза -->
                    <button
                        @click="restartQuiz"
                        class="size-12 shrink-0 tg__button outside flex justify-center items-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"
                            />
                            <path
                                fill-rule="evenodd"
                                d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <div class="tg__container header block">
                <p class="text-lg">{{ outcome.description }}</p>
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
const { useWebApp, useWebAppMainButton } = await import('vue-tg');

const { initDataUnsafe } = useWebApp();
const { showMainButton, hideMainButton } = useWebAppMainButton();
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
        showMainButton();
        return answer !== undefined;
    } else if (currentQuestion.value.type === 'multiple-choice') {
        showMainButton();
        return answer && answer.length > 0;
    } else if (currentQuestion.value.type === 'text-answer') {
        showMainButton();
        return answer && answer.trim().length > 0;
    }
    hideMainButton();
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

function restartQuiz() {
    hasStarted.value = false;
    currentIndex.value = 0;
    userAnswers.value = {};
    isQuizCompleted.value = false;
    finalScore.value = 0;
    outcome.value = null;
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
    background-color: var(--tg-theme-secondary-bg-color);
    overflow-y: auto;
    max-height: 100vh;
}

/* .tg__button {
    background-color: var(--tg-theme-button-color);
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
} */
.tg__button2 {
    background-color: var(--tg-theme-bg-color);
    border: 4px solid var(--tg-theme-button-dcolor);
    border-radius: 0.75rem;
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

.tg__button {
    box-shadow: 0 10px 15px -3px var(--tg-theme-button-ttcolor),
        0 4px 6px -4px var(--tg-theme-button-ttcolor);
    background-image: linear-gradient(
        to bottom right,
        var(--tg-theme-button-color) 0%,
        var(--tg-theme-button-lcolor) 100%
    );
    color: var(--tg-theme-button-llcolor);
    border-radius: 0.5rem;
}

.tg__button.outside {
    border-radius: 0.75rem;
}

.tg__button3 {
    background-color: var(--tg-theme-button-dcolor);
    border-radius: 0.75rem;
}

h2 {
    --a: -45deg; /* control the angle */
    --t: 0.2em; /* thickness of the underline */
    color: var(--tg-theme-text-color);
}

h2 span {
    --_s: calc(var(--t) * cos(var(--a)));
    background: linear-gradient(
            var(--a),
            #0000 var(--_s),
            var(--tg-theme-button-lcolor) 0 calc(100% - var(--_s)),
            #0000 0
        )
        bottom/var(--i, 100%) var(--t) no-repeat;
    padding: 0 0.25em calc(var(--t) + 0.1em);
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
    transition: 0.3s;
    cursor: pointer;
}

input[type='radio']::before {
    content: '';
    width: 0.75em;
    height: 0.75em;
    border-radius: 50%;
    transform: scale(0);
    transition: 100ms transform ease-in-out;
    box-shadow: inset 1em 1em var(--tg-theme-secondary-bg-color);
}

input[type='radio']:checked::before {
    transform: scale(1);
}

img {
    border-radius: 0.75rem 0.75rem 0 0;
}

.tg__container {
    background-color: var(--tg-theme-section-bg-color);
    width: 100%;

    border-radius: 0.75rem;
    display: flex;
    flex-direction: column;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.tg__container .header,
.tg__container.header {
    background-color: var(--tg-theme-section-bg-dcolor);
    border-radius: 0.75rem;
}

.tg__container .block,
.tg__container.block {
    padding: 1.25rem 1.5rem;
}
.tg__container .block-sm,
.tg__container.block-sm {
    padding: 0.5rem 0.75rem;
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

label {
    font-size: 1.25rem;
}

.progress-bar {
    width: 100%;
    height: 12px;
    background-color: #e5e5e5;
    overflow: hidden;
}

.progress {
    height: 100%;
    background-color: var(--tg-theme-button-color);
    transition: width 0.3s ease;
}
</style>
