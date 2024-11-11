<script setup>
const { useWebApp } = await import('vue-tg');
const { initDataUnsafe } = useWebApp();

const isLoading = ref(false);
const quizStore = useQuizStore();
const { fetchQuizMetadata } = quizStore;
const { quizzes, currentQuiz } = storeToRefs(quizStore);
const route = useRoute();

const openQuiz = async quizId => {
    await navigateTo(`/quizzes/${quizId}/edit`);
};

const createQuiz = async () => {
    const telegram_id = initDataUnsafe?.user?.id ?? 404;
    await quizStore.createQuiz(telegram_id);
};

onMounted(async () => {
    // Импровизация быстрая
    const startApp = initDataUnsafe?.start_param ?? route.query?.startapp;
    if (!!startApp) {
        const link = `/quizzes/${startApp}`;
        await navigateTo(link);
    }

    const telegram_id = initDataUnsafe?.user?.id ?? 404;

    try {
        const response = await $fetch(`/api/user?telegram_id=${telegram_id}`);
    } catch (e) {
        console.log(e);
    }

    await fetchQuizMetadata(telegram_id);
});
</script>

<template>
    <div class="w-full flex flex-col gap-6">
        <div class="flex flex-col gap-2">
            <h6 class="text-sm font-semibold tg-hint ms-2 tg-hint uppercase">
                Мои квизы
            </h6>
            <button
                class="flex w-full items-center justify-center tg-button s p-1 overflow-hidden text-lg font-semibold rounded-xl px-5 py-2"
                @click="createQuiz"
                :disabled="isLoading"
            >
                <div
                    v-if="!isLoading"
                    class="flex flex-row items-center justify-center gap-1"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
                        />
                    </svg>
                    <span>Создать</span>
                </div>
                <div v-else class="w-full items-center flex shimmer">
                    <div class="h-4 w-full grow-1"></div>
                </div>
            </button>
        </div>
        <div v-if="!isLoading" class="flex flex-col gap-2">
            <button
                class="w-full text-left font-semibold p-2 rounded-xl flex flex-row tg-section flex items-center"
                @click="openQuiz(quiz._id)"
                v-for="quiz in quizzes"
            >
                <div
                    class="grow-0 mr-2 flex items-center justify-center rounded-lg shrink-0 size-12"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                    >
                        <path
                            d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z"
                        ></path>
                    </svg>
                </div>
                <div class="grow-1">{{ quiz.title }}</div>
            </button>
        </div>
    </div>
</template>

<style scoped>
.shimmer {
    animation: shimmer 4s linear infinite;
    background-size: 400%;

    background-image: linear-gradient(
        to right,
        transparent 0%,
        var(--tg-theme-text-ttcolor) 50%,
        transparent 100%
    );
}

.tg-section {
    background-color: var(--tg-theme-section-bg-color);
    color: var(--tg-theme-text-color);
    height: 64px;
}

@keyframes shimmer {
    0% {
        background-position: -200%;
    }
    100% {
        background-position: 200%;
    }
}
</style>
