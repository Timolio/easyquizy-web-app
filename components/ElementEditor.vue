<template>
    <div class="flex flex-col gap-4 mb-5">
        <ImageUploader v-model="element.image_url" />

        <div v-if="element.image_url">
            <img
                :src="element.image_url"
                alt="Element Image"
                class="max-w-full h-auto mt-4 rounded"
            />
        </div>

        <input
            v-model="element.title"
            placeholder="Title"
            class="p-2 border border-gray-300 rounded"
            required
        />
        <textarea
            v-model="element.description"
            placeholder="Description"
            class="p-2 border border-gray-300 rounded min-h-[80px]"
        ></textarea>
        <select
            v-model="element.type"
            class="p-2 border border-gray-300 rounded"
        >
            <option value="single-choice">Single Choice</option>
            <option value="multiple-choice">Multiple Choice</option>
            <option value="text-answer">Text Answer</option>
        </select>

        <div>
            <h3 class="font-semibold">Options</h3>
            <OptionInput
                v-for="(option, index) in element.options"
                :key="index"
                :option="option"
                @remove="removeOption(index)"
            />
            <button
                @click="addOption"
                class="text-sm px-4 py-2 bg-green-500 text-white rounded mt-2 hover:bg-green-600"
            >
                Add Option
            </button>
        </div>

        <button
            @click="$emit('delete')"
            class="text-sm px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
            Delete Question
        </button>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import OptionInput from '~/components/OptionInput.vue';
import ImageUploader from './ImageUploader.vue';

const props = defineProps({
    element: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['delete']);

function addOption() {
    props.element.options.push({ text: '', score: 0 });
}

function removeOption(index) {
    props.element.options.splice(index, 1);
}
</script>
