<template>
    <div
        class="question-editor fixed inset-0 flex justify-center overflow-y-auto"
    >
        <div class="w-full max-w-3xl">
            <!-- Поля для названия и описания вопроса -->
            <ImageUploader
                class="w-full text-lg"
                v-model="localQuestion.image_url"
            />
            <div class="question-block flex flex-col gap-2 px-5 py-2">
                <h2 class="font-semibold py-1">Вопрос</h2>
                <textarea
                    v-model="localQuestion.title"
                    placeholder="Задайте вопрос"
                    rows="1"
                    @keydown.enter.prevent
                    oninput="this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';"
                    class="w-full input py-1 text-lg"
                ></textarea>
            </div>
            <div class="question-block flex flex-col gap-2 px-5 py-2">
                <h2 class="font-semibold py-1">Описание</h2>
                <textarea
                    v-model="localQuestion.description"
                    placeholder="Описание вопроса (необязательно)"
                    rows="1"
                    @keydown.enter.prevent
                    oninput="this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';"
                    class="w-full input py-1 text-lg"
                ></textarea>
            </div>
            <div class="question-block flex flex-col gap-2 px-5 py-2">
                <h2 class="font-semibold py-1">Тип</h2>
                <select
                    v-model="localQuestion.type"
                    class="w-full input py-1 text-lg"
                >
                    <option value="single-choice">Один из списка</option>
                    <option value="multiple-choice">Несколько из списка</option>
                    <option value="text-answer">Текстовый ответ</option>
                </select>
            </div>

            <!-- Список опций -->
            <div class="mb-6 question-block flex flex-col gap-2 ps-5 pt-2">
                <h2 class="font-semibold py-1">Варианты ответа</h2>
                <VueDraggableNext
                    v-model="localQuestion.options"
                    :animation="200"
                >
                    <div
                        v-for="(option, index) in localQuestion.options"
                        :key="index"
                        class="flex flex-col w-full"
                    >
                        <div
                            class="flex flex-row items-center text-lg gap-4 pe-5"
                        >
                            <!-- Инпут для текста опции -->
                            <textarea
                                v-model="option.text"
                                :placeholder="
                                    option.isPhantom
                                        ? 'Добавить ответ...'
                                        : 'Option Text'
                                "
                                rows="1"
                                @keydown.enter.prevent
                                oninput="this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';"
                                @input="handleOptionInput(option)"
                                @blur="handleOptionBlur(option, index)"
                                class="grow input py-3"
                            ></textarea>

                            <!-- Инпут для score и кнопка удаления только если это не фантомная опция -->
                            <input
                                v-if="!option.isPhantom"
                                v-model.number="option.score"
                                type="number"
                                placeholder="Score"
                                class="input w-12 grow-0 h-full text-center"
                            />
                            <button
                                v-if="!option.isPhantom"
                                @click="removeOption(index)"
                                class="tg__red font-bold text-xl"
                            >
                                ×
                            </button>
                        </div>
                        <hr v-if="!option.isPhantom" />
                    </div>
                </VueDraggableNext>
            </div>

            <!-- Кнопки управления -->
            <div class="flex justify-end space-x-4 sticky bottom-0">
                <button
                    @click="handleSave"
                    class="px-6 py-3 rounded-md text-white font-semibold bg-blue-500 hover:bg-blue-600"
                >
                    Save
                </button>
                <button
                    @click="$emit('close')"
                    class="px-6 py-3 rounded-md bg-gray-300 font-semibold"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
    <BackButton @click="$emit('close')" />
</template>

<script setup>
import { VueDraggableNext } from 'vue-draggable-next';

const { BackButton } = await import('vue-tg');

const props = defineProps(['question']);
const emit = defineEmits(['close']);

const { currentQuiz } = useQuizStore();
const { addNotification } = useNotificationStore();

const localQuestion = ref(JSON.parse(JSON.stringify(props.question)));

const ensurePhantomOption = () => {
    const options = localQuestion.value.options;
    if (!options.length || !options[options.length - 1].isPhantom) {
        options.push({ text: '', score: 0, isPhantom: true });
    }
};

const handleOptionInput = option => {
    if (option.isPhantom && option.text.trim() !== '') {
        option.isPhantom = false;
        ensurePhantomOption();
    }
};

const handleOptionBlur = (option, index) => {
    if (!option.isPhantom && option.text.trim() === '') {
        removeOption(index);
    }
};

const addOption = () => {
    localQuestion.value.options.push({ text: '', score: 0 });
};

const removeOption = index => {
    localQuestion.value.options.splice(index, 1);
};

const hasTwoOptions = () => {
    return (
        localQuestion.value.options.filter(option => option.text.trim() !== '')
            .length >= 2
    );
};

const save = () => {
    localQuestion.value.options = localQuestion.value.options.filter(
        option => option.text.trim() !== ''
    );
    if (!currentQuiz.elements.includes(props.question)) {
        currentQuiz.elements.push(localQuestion.value);
    } else {
        Object.assign(props.question, localQuestion.value);
    }
    emit('close');
};

const handleSave = () => {
    if (localQuestion.value.title.trim() === '') {
        addNotification('Укажите вопрос.');
    } else if (!hasTwoOptions()) {
        addNotification('Укажите не менее двух вариантов ответа.');
    } else {
        save();
    }
};

onMounted(() => {
    ensurePhantomOption();
    document.querySelectorAll('textarea').forEach(el => {
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    });
});
</script>

<style scoped>
.question-editor {
    background-color: var(--tg-theme-secondary-bg-color);
    overflow-y: auto;
}

h2 {
    color: var(--tg-theme-section-header-text-color);
}

.input {
    background: none;
    /* background-color: var(--tg-theme-secondary-bg-color); */
    border: none;
    color: var(--tg-theme-text-color);
    outline: none;
}

.question-block {
    background-color: var(--tg-theme-section-bg-color);
    color: var(--tg-theme-button-text-color);
    margin-bottom: 1rem;
    box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.2);
}
</style>
