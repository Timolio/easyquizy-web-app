<template>
    <div v-if="quiz">
        <!-- Стартовый экран -->
        <div v-if="!hasStarted" class="start-screen text-center p-5">
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

                <!-- Next button -->
                <button
                    @click="nextQuestion"
                    class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {{ isLastQuestion ? 'Finish' : 'Next' }}
                </button>
            </div>
        </div>

        <!-- Quiz result -->
        <div v-else class="result text-center p-5">
            <h2 class="text-2xl font-bold mb-4">Quiz Result</h2>
            <p class="text-lg">{{ resultText }}</p>
            <p class="mt-4 text-gray-500">Your Score: {{ finalScore }}%</p>
        </div>
    </div>

    <div v-else class="text-center p-5">
        <p>Loading quiz...</p>
    </div>
</template>

<script setup>
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
const resultText = ref('');

// Load quiz on mount
onMounted(async () => {
    const quizId = route.params.quizId;
    await quizStore.fetchQuizById(quizId, initDataUnsafe?.user?.id ?? 404);
});

// Computed properties for current question and last question check
const currentQuestion = computed(
    () => quiz.value?.elements[currentIndex.value]
);
const isLastQuestion = computed(
    () => currentIndex.value === quiz.value?.elements.length - 1
);

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

// Navigate to next question
async function nextQuestion() {
    if (isLastQuestion.value) {
        await completeQuiz();
    } else {
        currentIndex.value++;
        initializeAnswer(currentIndex.value);
    }
}

// Complete quiz
async function completeQuiz() {
    isQuizCompleted.value = true;
    calculateScore();
    const telegramId = initDataUnsafe?.user?.id ?? 404;

    try {
        const response = await $fetch('/api/results', {
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
            // Учитываем только положительные баллы для maxScore
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
            // Учитываем только положительные баллы для maxScore
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

    // Ограничиваем общий балл, чтобы он не опускался ниже нуля
    totalScore = Math.max(0, totalScore);

    finalScore.value = Math.round((totalScore / maxScore) * 100);

    // Определяем outcome на основе итогового процента
    const outcome = quiz.value.outcomes
        .sort((a, b) => a.min_percentage - b.min_percentage)
        .reverse()
        .find(o => finalScore.value >= o.min_percentage);

    resultText.value = outcome ? outcome.text : 'No outcome available';
}
</script>

<style scoped>
.quiz-container {
    max-width: 600px;
    margin: 0 auto;
}

.start-screen {
    max-width: 600px;
    margin: 0 auto;
}
</style>
