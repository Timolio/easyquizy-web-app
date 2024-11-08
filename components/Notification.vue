<template>
    <div
        class="bg-red-500 text-white p-4 shadow-lg flex justify-between items-center mb-2 w-full max-w-screen animate-slide-up"
        :class="{ 'animate-fade-out': isFadingOut }"
        @animationend="handleAnimationEnd"
    >
        <div>{{ message }}</div>
        <button @click="closeImmediately" class="ml-4 font-bold text-xl">
            ×
        </button>
    </div>
</template>

<script setup>
const props = defineProps(['message', 'duration']);
const emit = defineEmits(['close']);

const isFadingOut = ref(false);
let timer;

onUnmounted(() => clearTimeout(timer));
timer = setTimeout(() => {
    isFadingOut.value = true;
}, props.duration - 500);

const closeImmediately = () => {
    clearTimeout(timer);
    emit('close');
};

const handleAnimationEnd = () => {
    if (isFadingOut.value) emit('close');
};
</script>

<style>
@keyframes slide-up {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fade-out {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

.animate-slide-up {
    animation: slide-up 0.3s ease-out;
}

.animate-fade-out {
    animation: fade-out 0.5s ease-out forwards;
}
</style>
