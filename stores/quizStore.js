export const useQuizStore = defineStore('quiz', {
    state: () => ({
        quizzes: [],
        currentQuiz: null,
        isLoaded: false,
        saving: false,
    }),
    actions: {
        async fetchQuizMetadata(user_id) {
            if (this.isLoaded) return;

            console.log(user_id);

            try {
                const { data } = await $fetch(`/api/quizzes/user/${user_id}`, {
                    method: 'GET',
                });

                this.quizzes = data;
                this.isLoaded = true;
            } catch (e) {
                console.error('Failed to fetch metadata', e);
            }
        },
        async saveQuiz() {
            const { _id } = this.currentQuiz;
            try {
                this.saving = true;
                await $fetch(`/api/quizzes/${_id}`, {
                    method: 'PUT',
                    body: this.currentQuiz,
                });
            } catch (e) {
                console.error('Failed to save quiz: ', e);
            } finally {
                this.saving = false;
            }
        },
        async fetchQuizById(quizId, telegramId) {
            if (this.currentQuiz?._id === quizId) return;

            try {
                const { data } = await $fetch(`/api/quizzes/${quizId}/detail`, {
                    method: 'GET',
                    headers: {
                        'X-Telegram-ID': telegramId,
                    },
                });

                this.currentQuiz = data;
                console.log(this.currentQuiz.outcomes);
            } catch (e) {
                console.error('Failed to fetch quiz', e);
            }
        },
        addElement(element) {
            this.currentQuiz.elements.push(element);
        },
        deleteElement(index) {
            this.currentQuiz.elements.splice(index, 1);
        },
        clearCurrentQuiz() {
            this.currentQuiz = null;
        },
    },
});
