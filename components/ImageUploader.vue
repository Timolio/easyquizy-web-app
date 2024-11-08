<template>
    <div class="uploader">
        <input
            v-if="!imageUrl"
            type="file"
            @change="uploadImage"
            accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
            class="input-file"
        />
        <div class="relative">
            <img v-if="imageUrl" :src="imageUrl" class="uploaded-image" />
            <button
                class="reset-button absolute top-1 right-1 p-3"
                v-if="imageUrl"
                @click="resetImage"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    class="bi bi-trash-fill"
                    viewBox="0 0 16 16"
                >
                    <path
                        d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"
                    />
                </svg>
            </button>
        </div>
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
.uploader {
    color: var(--tg-theme-text-color);
}
.label {
    color: var(--tg-theme-accent-text-color);
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    display: block;
}
.input-file {
    /* background-color: var(--tg-theme-secondary-bg-color); */
    color: var(--tg-theme-text-color);
    border: none;
    padding: 0.5rem;
    border-radius: 4px;
    width: 100%;
}
.uploaded-image {
    max-width: 100%;
    height: auto;
    /* border-radius: 8px; */
}
.reset-button {
    /* margin-top: 1rem; */
    color: var(--tg-theme-destructive-text-color);
    /* background: none;
    border: none;
    font-weight: bold;
    cursor: pointer; */
}
</style>
