<template>
    <div class="grid-view-overlay" @click.self="$emit('close')">
        <draggable class="grid" :list="elements" :animation="200">
            <div
                v-for="(element, index) in elements"
                :key="index"
                class="grid-item"
                @click="selectElement(index)"
            >
                <p>{{ element.text || `Question ${index + 1}` }}</p>
            </div>
        </draggable>
        <button class="close-button" @click="$emit('close')">Close</button>
    </div>
</template>

<script setup>
import { VueDraggableNext as draggable } from 'vue-draggable-next';

const props = defineProps({
    elements: {
        type: Array,
        required: true,
    },
});

const emit = defineEmits(['close', 'selectElement']);

function selectElement(index) {
    emit('selectElement', index);
}
</script>

<style>
.grid-view-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    /* justify-content: center; */
    padding: 20px;
    overflow-y: auto;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 10px;
    width: 100%;
    max-width: 500px;
    pointer-events: none;
}

.grid-item {
    height: 80px;
    background-color: var(--tg-theme-section-bg-color);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 14px;
    padding: 5px;
    cursor: pointer;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    pointer-events: all;
}

.close-button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #ff5c5c;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
}
</style>
