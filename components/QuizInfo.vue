<template>
    <div class="quiz-info">
        <ImageUploader class="uploader" v-model="currentQuiz.image_url" />
        <div class="flex flex-col gap-2 px-5 py-2">
            <h2 class="font-semibold py-1">Общее</h2>
            <textarea
                v-model="currentQuiz.title"
                rows="1"
                @keydown.enter.prevent
                oninput="this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';"
                placeholder="Дайте заголовок"
                class="input py-1 text-lg"
            ></textarea>
            <hr />
            <textarea
                v-model="currentQuiz.description"
                rows="1"
                @keydown.enter.prevent
                oninput="this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';"
                placeholder="Придумайте описание"
                class="input py-1 text-lg"
            ></textarea>
        </div>
    </div>
</template>

<script setup>
const quizStore = useQuizStore();
const { currentQuiz } = storeToRefs(quizStore);

onMounted(() => {
    document.querySelectorAll('textarea').forEach(el => {
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    });
});
</script>

<style scoped>
.input {
    width: 100%;
    background: none;
    /* background-color: var(--tg-theme-secondary-bg-color); */
    border: none;
    border-radius: 4px;
    color: var(--tg-theme-text-color);
    outline: none;
}

hr {
    border-color: var(--tg-theme-section-separator-color);
    border-width: 0.5px;
}

h2 {
    color: var(--tg-theme-section-header-text-color);
}

.quiz-info {
    background-color: var(--tg-theme-section-bg-color);
    color: var(--tg-theme-button-text-color);
    margin-bottom: 1rem;
    box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.2);
}
</style>
