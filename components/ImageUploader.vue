<template>
    <div>
        <!-- <label class="block mb-2 text-gray-700">Upload Image</label> -->
        <input
            type="file"
            @change="uploadImage"
            accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
        />
        <!-- <img
            v-if="imageUrl"
            :src="imageUrl"
            class="mt-4 max-w-full h-auto rounded"
        /> -->
    </div>
</template>

<script setup>
import { ref } from 'vue';

const imageUrl = ref(null);
const props = defineProps({
    modelValue: String,
});
const emit = defineEmits(['update:modelValue']);

watch(imageUrl, newUrl => {
    emit('update:modelValue', newUrl);
});

async function uploadImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const { uploadUrl, publicUrl } = await $fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': file.type },
            body: { filename: file.name },
        });

        await $fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': file.type },
            body: file,
        });

        imageUrl.value = publicUrl;
    } catch (error) {
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
