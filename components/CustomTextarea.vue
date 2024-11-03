<template>
    <textarea
        ref="textarea"
        class="auto-resize-textarea"
        :rows="1"
        v-bind="model"
        @input="resizeTextarea"
        @keydown.enter.prevent="disableNewLine"
    ></textarea>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
const textarea = ref(null);

const props = defineProps({
    model: { type: String, default: '' },
});

const resizeTextarea = () => {
    if (textarea.value) {
        textarea.value.style.height = 'auto';
        textarea.value.style.height = `${textarea.value.scrollHeight}px`;
    }
};

const disableNewLine = event => {
    event.preventDefault();
};

watch(textarea.value?.value, resizeTextarea());

onMounted(() => {
    resizeTextarea();
});
</script>

<style scoped>
.auto-resize-textarea {
    resize: none;
    overflow: hidden;
}
</style>
