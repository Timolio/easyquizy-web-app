<template>
    <div class="flex flex-col items-center space-y-4">
        <h2 class="text-2xl font-bold mb-4">Edit Outcomes</h2>

        <!-- Редактирование каждого outcome -->
        <div
            v-for="(outcome, index) in sortedOutcomes"
            :key="outcome._id"
            class="w-full max-w-md p-4 bg-white rounded shadow-lg space-y-2"
        >
            <div class="flex items-center justify-between">
                <h3 class="font-semibold text-lg">Outcome {{ index + 1 }}</h3>

                <!-- Удаление outcome, кроме обязательного с 0% -->
                <button
                    v-if="index > 0"
                    @click="removeOutcome(index)"
                    class="text-sm px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Delete
                </button>
            </div>

            <!-- Поле для редактирования минимального процента, кроме первого и последнего outcomes -->
            <div v-if="index > 0" class="flex items-center space-x-2">
                <label class="text-gray-600">Min %:</label>
                <input
                    v-model.number="outcome.min_percentage"
                    type="number"
                    :min="minPercentageLimit(index)"
                    :max="maxPercentageLimit(index)"
                    class="w-20 p-2 border border-gray-300 rounded"
                />
            </div>

            <!-- Поле для редактирования текста -->
            <textarea
                v-model="outcome.text"
                placeholder="Outcome Text"
                class="w-full p-2 border border-gray-300 rounded"
            ></textarea>
        </div>

        <!-- Кнопка добавления нового outcome -->
        <button
            @click="addOutcome"
            class="text-lg px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
            Add Outcome
        </button>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    outcomes: {
        type: Array,
        required: true,
    },
});

const emit = defineEmits(['update']);

// Реактивная копия для редактирования
const editedOutcomes = ref([...props.outcomes]);

// Сортировка outcomes по min_percentage
const sortedOutcomes = computed(() => {
    return [...editedOutcomes.value].sort(
        (a, b) => a.min_percentage - b.min_percentage
    );
});

// Удаление outcome, кроме первого с 0%
function removeOutcome(index) {
    editedOutcomes.value.splice(index, 1);
    emit('update', editedOutcomes.value);
}

// Добавление нового outcome
function addOutcome() {
    const maxPercentage =
        sortedOutcomes.value[sortedOutcomes.value.length - 1].min_percentage ||
        0;
    editedOutcomes.value.push({
        text: '',
        min_percentage: Math.min(maxPercentage + 10, 100),
    });
    emit('update', editedOutcomes.value);
}

// Определяем минимальное значение для min_percentage
function minPercentageLimit(index) {
    return sortedOutcomes.value[index - 1]?.min_percentage + 1 || 0;
}

// Определяем максимальное значение для min_percentage
function maxPercentageLimit(index) {
    return sortedOutcomes.value[index + 1]?.min_percentage - 1 || 100;
}

// Отслеживаем изменения и отправляем их наружу
watch(
    editedOutcomes,
    newOutcomes => {
        emit('update', newOutcomes);
    },
    { deep: true }
);
</script>
