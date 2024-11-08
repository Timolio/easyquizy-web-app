<template>
    <div v-if="quiz">
        <!-- Стартовый экран -->
        <div v-if="!hasStarted" class="start-screen text-center p-5">
            <img class="mb-4" :src="quiz.image_url" />
            <h1 class="text-3xl font-bold mb-4">{{ quiz.title }}</h1>
            <p class="text-lg mb-6">{{ quiz.description }}</p>
            <button
                @click="startQuiz"
                class="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Начать
            </button>
        </div>

        <!-- Экран прохождения квиза -->
        <div v-else-if="!isQuizCompleted" class="quiz-container p-5">
            <!-- Индикатор прогресса -->
            <div class="flex justify-between items-center mb-6">
                <p class="text-lg font-semibold">
                    {{ currentIndex + 1 }} / {{ totalQuestions }}
                </p>
            </div>

            <div v-if="currentQuestion" class="question">
                <img class="mb-4" :src="currentQuestion.image_url" />
                <h2 class="text-2xl font-bold mb-4">
                    {{ currentQuestion.title }}
                </h2>
                <p class="mb-4">{{ currentQuestion.description }}</p>

                <!-- Single-choice question -->
                <div v-if="currentQuestion.type === 'single-choice'">
                    <label
                        v-for="(option, index) in currentQuestion.options"
                        :key="index"
                        class="block mb-2"
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

                <!-- Navigation buttons -->
                <div class="mt-4 flex justify-between">
                    <button
                        v-if="currentIndex > 0"
                        @click="prevQuestion"
                        class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Back
                    </button>
                    <button
                        @click="nextQuestion"
                        v-if="isAnswerSelected"
                        class="px-4 py-2 text-white rounded bg-blue-500 hover:bg-blue-600"
                    >
                        {{ isLastQuestion ? 'Finish' : 'Next' }}
                    </button>
                </div>

                <!-- Прогресс-бар -->
                <div class="progress-bar mt-6">
                    <div
                        class="progress"
                        :style="{ width: progressPercentage + '%' }"
                    ></div>
                </div>
            </div>
        </div>

        <!-- Quiz result -->
        <div v-else class="result text-center p-5">
            <img class="mb-4" :src="outcome.image_url" />
            <h2 class="text-2xl font-bold mb-4">Quiz Result</h2>
            <p class="text-lg">{{ outcome.text }}</p>
            <p class="mt-4 text-gray-500">Your Score: {{ finalScore }}%</p>
        </div>
    </div>

    <div v-else class="text-center p-5">
        <p>Loading quiz...</p>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
const { useWebApp } = await import('vue-tg');

const { initDataUnsafe } = useWebApp();
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
    margin: 0 auto;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background-color: #e5e5e5;
    border-radius: 4px;
    overflow: hidden;
}

.progress {
    height: 100%;
    background-color: #3b82f6;
    transition: width 0.3s ease;
}
</style>
