<template>
    <div class="element-editor flex flex-col gap-4 px-5 py-4 h-full">
        <div class="flex flex-row gap-3 items-center grow-0">
            <h6 class="tg-hint text-sm uppercase grow-0 font-normal">
                Тип элемента
            </h6>
            <select class="grow tg" v-model="element.type">
                <option value="single-choice">Single Choice</option>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="text-answer">Text Answer</option>
            </select>
        </div>
        <div class="flex flex-col gap-0.5 grow-0">
            <h6 class="uppercase tg-hint text-sm font-normal">Текст</h6>
            <textarea
                class="tg"
                rows="1"
                v-model="element.text"
                @keydown.enter.prevent
                oninput="this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';"
                type="text"
                required
            ></textarea>
        </div>

        <div class="flex flex-col grow">
            <h6 class="tg-hint text-sm uppercase grow-0 font-normal">
                Варианты
            </h6>
            <draggable :list="element.options">
                <div v-for="(option, index) in element.options" :key="index">
                    <input v-model="option.text" type="text" class="tg" />
                    <input
                        v-model.number="option.score"
                        type="number"
                        class="tg"
                    />
                    <button @click="removeOption(index)">
                        Удалить вариант
                    </button>
                </div>
            </draggable>
            <button @click="addOption">Добавить вариант</button>
        </div>

        <button @click="$emit('delete')">Удалить элемент</button>
    </div>
</template>

<script setup>
import { VueDraggableNext as draggable } from 'vue-draggable-next';

const props = defineProps({
    element: {
        type: Object,
        required: true,
    },
});

function addOption() {
    props.element.options.push({ text: '', score: 0 });
}

function removeOption(index) {
    props.element.options.splice(index, 1);
}
</script>
