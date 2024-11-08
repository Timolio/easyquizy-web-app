<template>
    <div>
        <button
            @click="$emit('create')"
            class="bg-green-500 text-white px-4 py-2 rounded-md mb-4"
        >
            Create New Outcome
        </button>
        <ul>
            <li
                v-for="(outcome, index) in sortedOutcomes"
                :key="index"
                class="flex justify-between items-center mb-2 p-2 border rounded-md"
            >
                <span>{{ outcome.text }} {{ outcome.min_percentage }}</span>
                <button @click="$emit('edit', outcome)" class="text-blue-500">
                    Edit
                </button>
            </li>
        </ul>
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
