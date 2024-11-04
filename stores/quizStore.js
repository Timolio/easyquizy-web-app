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
        async saveQuiz(telegramId) {
            const { _id } = this.currentQuiz;
            try {
                this.saving = true;
                await $fetch(`/api/quizzes/${_id}`, {
                    method: 'PUT',
                    headers: {
                        'X-Telegram-ID': telegramId,
                    },
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
        async createQuiz(telegramId) {
            try {
                const { data } = await $fetch('/api/quizzes', {
                    method: 'POST',
                    body: {
                        user_id: telegramId,
                        title: 'Example Quiz',
                        description: 'This is an example quiz.',
                        elements: [
                            {
                                title: 'What is the capital of France?',
                                description: 'Try to recall',
                                type: 'single-choice',
                                options: [
                                    { text: 'Paris', score: 10 },
                                    { text: 'London', score: 0 },
                                    { text: 'Berlin', score: 0 },
                                ],
                            },
                        ],
                        outcomes: [
                            { text: 'Excellent', min_percentage: 90 },
                            { text: 'Good', min_percentage: 70 },
                            { text: 'Keep trying', min_percentage: 50 },
                            { text: 'Bad', min_percentage: 0 },
                        ],
                    },
                });
                this.quizzes.push(data);
            } catch (e) {
                console.error('Failed to create quiz', e);
            }
        },
    },
});
