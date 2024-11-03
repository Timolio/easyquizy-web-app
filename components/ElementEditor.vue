<template>
    <div class="element-editor flex flex-col gap-3 h-full">
        <div class="con flex flex-row gap-3 items-center grow-0">
            <h6 class="tg-hint text-sm uppercase grow-0 font-normal">
                Тип элемента
            </h6>
            <select class="grow tg" v-model="element.type">
                <option value="single-choice">Single Choice</option>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="text-answer">Text Answer</option>
            </select>
        </div>
        <div class="con flex flex-col gap-1 grow-0">
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

        <div class="con flex flex-col grow gap-1">
            <h6 class="tg-hint text-sm uppercase grow-0 font-normal">
                Варианты
            </h6>
            <draggable class="flex flex-col gap-3" :list="element.options">
                <div
                    class="flex flex-col"
                    v-for="(option, index) in element.options"
                    :key="index"
                >
                    <textarea
                        rows="1"
                        v-model="option.text"
                        @keydown.enter.prevent
                        oninput="this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';"
                        type="text"
                        class="tg"
                    ></textarea>
                    <div class="flex flex-row">
                        <input
                            v-model.number="option.score"
                            type="number"
                            class="tg grow"
                        />
                        <button class="delete" @click="removeOption(index)">
                            Удалить
                        </button>
                    </div>
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

<style scoped>
.con {
    background-color: var(--tg-theme-section-bg-dcolor);
    padding: 0.8rem 1.2rem;
    border-radius: 0.75rem;
}

.delete {
    background-color: var(--tg-theme-destructive-text-color);
}
</style>
