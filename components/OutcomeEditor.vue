<template>
    <div class="editor-container">
        <div class="editor">
            <ImageUploader v-model="localOutcome.image_url" />
            <input
                v-model="localOutcome.text"
                placeholder="Текст исхода"
                class="input"
            />
            <input
                v-model="localOutcome.min_percentage"
                type="number"
                placeholder="Минимальный процент"
                class="input"
            />
            <div class="actions">
                <button @click="handleSave" class="save-button">
                    Сохранить
                </button>
                <button @click="$emit('close')" class="close-button">
                    Закрыть
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['outcome']);
const emit = defineEmits(['close']);

const { currentQuiz } = useQuizStore();
const { addNotification } = useNotificationStore();

const localOutcome = ref(JSON.parse(JSON.stringify(props.outcome)));

const isPercentageUnique = computed(() => {
    return !currentQuiz.outcomes.some(
        outcome =>
            outcome.min_percentage === localOutcome.value.min_percentage &&
            outcome._id !== localOutcome.value._id
    );
});

const save = () => {
    if (!currentQuiz.outcomes.includes(props.outcome)) {
        currentQuiz.outcomes.push(localOutcome.value);
    } else {
        Object.assign(props.outcome, localOutcome.value);
    }
    emit('close');
};

const handleSave = () => {
    if (!isPercentageUnique.value) {
        // addNotification('An outcome with this percentage already exists.');
        addNotification('Исход с таким процентом уже существует.');
    } else {
        save();
    }
};
</script>

<style scoped>
.editor-container {
    background-color: var(--tg-theme-bg-color);
    display: flex;
    justify-content: center;
    padding: 2rem;
    position: fixed;
    inset: 0;
    overflow-y: auto;
}
.editor {
    width: 100%;
    max-width: 600px;
}
.input {
    width: 100%;
    padding: 0.5rem;
    background-color: var(--tg-theme-secondary-bg-color);
    border: none;
    border-radius: 4px;
    color: var(--tg-theme-text-color);
    margin-bottom: 1rem;
}
.actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}
.save-button {
    background-color: var(--tg-theme-button-color);
    color: var(--tg-theme-button-text-color);
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
.close-button {
    background-color: var(--tg-theme-section-separator-color);
    color: var(--tg-theme-text-color);
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
</style>
