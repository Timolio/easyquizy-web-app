<template>
    <div class="outcome-list ps-5 pt-2">
        <h2 class="font-semibold py-1">Исходы</h2>

        <div>
            <div
                v-for="(outcome, index) in sortedOutcomes"
                :key="index"
                class="outcome-item flex flex-col text-lg"
            >
                <div class="flex flex-row pe-4 gap-2">
                    <span class="py-3 grow">
                        От {{ outcome.min_percentage }}% до
                        {{
                            sortedOutcomes[index + 1]?.min_percentage ?? 100
                        }}%</span
                    >
                    <button @click="$emit('edit', outcome)" class="edit-button">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            class="bi bi-pencil-square"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
                            />
                            <path
                                fill-rule="evenodd"
                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                            />
                        </svg>
                    </button>
                </div>
                <hr />
            </div>
        </div>
        <button
            @click="$emit('create')"
            class="add-button py-3 flex flex-row gap-2 items-center text-lg"
        >
            Добавить исход...
        </button>
    </div>
</template>

<script setup>
const { currentQuiz } = useQuizStore();

const sortedOutcomes = computed(() => {
    return [...currentQuiz.outcomes].sort(
        (a, b) => a.min_percentage - b.min_percentage
    );
});
</script>

<style scoped>
.outcome-list {
    background-color: var(--tg-theme-section-bg-color);
    color: var(--tg-theme-button-text-color);
    margin-bottom: 1rem;
    box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.2);
}

.outcome-item {
    color: var(--tg-theme-text-color);
}

h2 {
    color: var(--tg-theme-section-header-text-color);
}

.add-button {
    color: var(--tg-theme-subtitle-text-color);
}

.edit-button {
    color: var(--tg-theme-subtitle-text-color);
    background: none;
    border: none;
    cursor: pointer;
}
</style>
