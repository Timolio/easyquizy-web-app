<template>
    <div class="fixed inset-0 bg-white flex justify-center p-2 overflow-y-auto">
        <div class="w-full max-w-3xl">
            <h3 class="text-2xl font-bold mb-6">Edit Question</h3>

            <ImageUploader
                class="w-full rounded-md text-lg mb-4"
                v-model="localQuestion.image_url"
            />

            <!-- Поля для названия и описания вопроса -->
            <input
                v-model="localQuestion.title"
                placeholder="Question Title"
                class="w-full border border-gray-300 rounded-md p-4 text-lg mb-4"
            />
            <textarea
                v-model="localQuestion.description"
                placeholder="Question Description"
                class="w-full border border-gray-300 rounded-md p-4 text-lg mb-4"
            ></textarea>
            <select
                v-model="localQuestion.type"
                class="w-full border border-gray-300 rounded-md p-4 text-lg mb-6"
            >
                <option value="single-choice">Single Choice</option>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="text-answer">Text Answer</option>
            </select>

            <!-- Список опций -->
            <div class="mb-6">
                <h4 class="text-lg font-semibold mb-4">Options</h4>
                <div
                    v-for="(option, index) in localQuestion.options"
                    :key="index"
                    class="mb-4 flex space-x-2 items-center"
                >
                    <!-- Инпут для текста опции -->
                    <input
                        v-model="option.text"
                        :placeholder="
                            option.isPhantom ? 'Add Option' : 'Option Text'
                        "
                        @input="handleOptionInput(option)"
                        @blur="handleOptionBlur(option, index)"
                        class="w-full border border-gray-300 rounded-md p-4"
                    />

                    <!-- Инпут для score и кнопка удаления только если это не фантомная опция -->
                    <input
                        v-if="!option.isPhantom"
                        v-model.number="option.score"
                        type="number"
                        placeholder="Score"
                        class="w-24 border border-gray-300 rounded-md p-4"
                    />
                    <button
                        v-if="!option.isPhantom"
                        @click="removeOption(index)"
                        class="text-red-500 font-bold"
                    >
                        x
                    </button>
                </div>
            </div>

            <!-- Кнопки управления -->
            <div class="flex justify-end space-x-4 sticky bottom-0 bg-white">
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
</template>

<script setup>
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
});
</script>
