<template>
    <div>
        <label class="block mb-2 text-gray-700">Upload Image</label>
        <input
            type="file"
            @change="uploadImage"
            accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
        />
        <img
            v-if="imageUrl"
            :src="imageUrl"
            class="mt-4 max-w-full h-auto rounded"
        />
        <button class="text-gray-700" v-if="imageUrl" @click="resetImage">
            Reset Image
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    modelValue: String,
});
const imageUrl = ref(props.modelValue);
const emit = defineEmits(['update:modelValue', 'error']);
const maxFileSize = 5 * 1024 * 1024;

const { addNotification } = useNotificationStore();

watch(
    () => props.modelValue,
    newValue => {
        imageUrl.value = newValue;
    }
);

watch(imageUrl, newUrl => {
    emit('update:modelValue', newUrl);
});

function resetImage() {
    imageUrl.value = null;
}

async function uploadImage(event) {
    const file = event.target.files[0];
    console.log(file.size);

    if (!file) return;
    if (file.size > maxFileSize) {
        addNotification('Размер файла не должен превышать 5 МБ.');
        return;
    }

    try {
        const { uploadUrl, publicUrl } = await $fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': file.type },
        });

        await $fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': file.type },
            body: file,
        });

        imageUrl.value = publicUrl;
    } catch (error) {
        addNotification(
            'Не удалось загрузить изображение. Повторите попытку позже.'
        );
        console.error('Failed to upload image:', error);
    }
}
</script>

<style scoped>
img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
}
</style>
