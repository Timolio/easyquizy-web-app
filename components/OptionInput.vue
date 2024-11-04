<template>
    <div class="flex items-center gap-2 mb-2">
        <input
            v-model="option.text"
            placeholder="Option Text"
            class="p-2 border border-gray-300 rounded"
        />
        <input
            v-model.number="option.score"
            type="number"
            placeholder="Score"
            class="p-2 border border-gray-300 rounded w-20"
        />
        <button
            @click="$emit('remove')"
            class="text-sm px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
            Remove
        </button>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    option: {
        type: Object,
        required: true,
    },
});
</script>
