<template>
    <div
        class="notification"
        :class="{ 'fade-out': isFadingOut }"
        @animationend="handleAnimationEnd"
    >
        <div>{{ message }}</div>
        <button @click="closeImmediately" class="close-button">×</button>
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

<style scoped>
.notification {
    background-color: var(--tg-theme-destructive-text-color);
    color: var(--tg-theme-button-text-color);
    padding: 1rem;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    animation: slide-up 0.3s ease-out;
}
.close-button {
    background: none;
    border: none;
    color: var(--tg-theme-button-text-color);
    font-size: 1.25rem;
    cursor: pointer;
}
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
.fade-out {
    animation: fade-out 0.5s ease-out forwards;
}
@keyframes fade-out {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}
</style>
