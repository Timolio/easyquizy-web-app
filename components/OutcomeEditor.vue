<template>
    <div class="fixed inset-0 bg-white flex justify-center p-2 overflow-y-auto">
        <div class="w-full max-w-3xl">
            <h3 class="text-lg font-bold mb-4">Edit Outcome</h3>
            <ImageUploader
                class="w-full rounded-md text-lg mb-4"
                v-model="localOutcome.image_url"
            />
            <input
                v-model="localOutcome.text"
                placeholder="Outcome Text"
                class="w-full border border-gray-300 rounded-md p-2 mb-2"
            />
            <input
                v-model="localOutcome.min_percentage"
                type="number"
                placeholder="Minimum Percentage"
                class="w-full border border-gray-300 rounded-md p-2 mb-4"
            />
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
