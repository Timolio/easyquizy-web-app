<template>
    <div class="element-editor flex flex-col gap-3 h-full">
        <div class="con flex flex-col grow-0">
            <div class="head rounded-xl flex flex-col gap-2">
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
                <!-- <h6 class="uppercase tg-hint text-sm font-normal">Вопрос</h6> -->
                <textarea
                    class="tg"
                    rows="1"
                    v-model="element.title"
                    @keydown.enter.prevent
                    placeholder="Вопрос"
                    oninput="this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';"
                    type="text"
                    required
                ></textarea>

                <textarea
                    class="tg small"
                    rows="1"
                    v-model="element.description"
                    @keydown.enter.prevent
                    placeholder="Описание"
                    oninput="this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';"
                    type="text"
                    required
                ></textarea>
            </div>
            <div class="px-3 py-2">
                <button
                    class="tg-destructive-button mr-2 flex items-center justify-center rounded-lg shrink-0 size-10"
                    @click="$emit('delete')"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"
                        />
                    </svg>
                </button>
            </div>
        </div>

        <div class="flex flex-col grow gap-1">
            <!-- <h6 class="tg-hint text-sm uppercase grow-0 font-normal">
                Варианты
            </h6> -->
            <draggable class="flex flex-col gap-3" :list="element.options">
                <div
                    class="flex flex-col op rounded-xl"
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
                            class="tg grow-0 size-12"
                        />
                        <button class="delete" @click="removeOption(index)">
                            Удалить
                        </button>
                    </div>
                </div>
            </draggable>
            <button @click="addOption">Добавить вариант</button>
        </div>
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
    background-color: var(--tg-theme-section-bg-color);

    border-radius: 0.75rem;
}

.tg-destructive-button {
    box-shadow: 0 10px 15px -3px var(--tg-theme-shadow-destructive-text-color),
        0 4px 6px -4px var(--tg-theme-shadow-destructive-text-color);
    /* background-image: linear-gradient(
        to bottom right,
        var(--tg-theme-destructive-text-color) 0%,
        var(--tg-theme-light-destructive-text-color) 100%
    ); */
    border: 3px solid var(--tg-theme-destructive-text-color);
    color: var(--tg-theme-destructive-text-color);
}

.con .head {
    background-color: var(--tg-theme-section-bg-dcolor);
    padding: 1rem 1.2rem;
}

.op {
    border: 2px dashed var(--tg-theme-section-bg-color);
    padding: 1rem 1.2rem;
}

.delete {
    background-color: var(--tg-theme-destructive-text-color);
}
</style>
