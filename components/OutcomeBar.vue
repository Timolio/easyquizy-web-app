<template>
    <div class="outcome-bar">
        <!-- Метки процентов над полосой -->
        <div class="percent-marks">
            <!-- Обязательная метка 0% -->
            <span class="mark" style="left: 0%">0%</span>

            <!-- Метки для каждого outcome -->
            <span
                v-for="(outcome, index) in sortedOutcomes"
                :key="outcome._id"
                class="mark"
                :style="{ left: (100 / outcomes.length) * index + '%' }"
            >
                {{ outcome.min_percentage }}%
            </span>

            <!-- Обязательная метка 100% -->
            <span class="mark" style="left: 100%">100%</span>
        </div>

        <!-- Полоса прогресса с равными отрезками для outcomes -->
        <div class="progress-bar">
            <div
                v-for="(outcome, index) in sortedOutcomes"
                :key="outcome._id"
                class="outcome-segment"
                :style="{ width: 100 / sortedOutcomes.length + '%' }"
                @click="editOutcome(index)"
            >
                <span class="outcome-label">{{ outcome.text }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    outcomes: {
        type: Array,
        required: true,
    },
});

const emit = defineEmits(['edit-outcome']);

// Сортируем outcomes по min_percentage
const sortedOutcomes = computed(() => {
    return [...props.outcomes].sort(
        (a, b) => a.min_percentage - b.min_percentage
    );
});

// Функция для редактирования outcome при нажатии на сегмент
function editOutcome(index) {
    emit('edit-outcome', index);
}
</script>

<style>
.outcome-bar {
    margin: 20px 0;
    width: 100%;
    position: relative;
}

.percent-marks {
    position: relative;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #000;
    margin-bottom: 8px;
    pointer-events: none;
    height: 20px;
}

.mark {
    position: absolute;
    transform: translateX(-50%);
}

.progress-bar {
    display: flex;
    height: 30px;
    background-color: #e0e0e0;
    border: 2px solid #000;
    border-radius: 10px;
    overflow: hidden;
}

.outcome-segment {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #4caf50;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
    position: relative;
}

.outcome-segment:not(:last-child) {
    border-right: 2px solid #fff;
}

.outcome-label {
    position: absolute;
    text-align: center;
    width: 100%;
    pointer-events: none;
}
</style>
