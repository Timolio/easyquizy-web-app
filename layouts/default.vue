<script setup>
useHead({
    script: [
        {
            src: 'https://telegram.org/js/telegram-web-app.js',
            defer: true,
        },
    ],
});
</script>

<template>
    <main>
        <ClientOnly>
            <slot />
            <StartApp />
            <NotificationsList />
        </ClientOnly>
    </main>
</template>

<style>
main {
    min-height: 100vh;
    /* padding: 0.6rem 0.8rem; */
}

/* Hide scrollbar for Chrome, Safari and Opera */
*::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
* {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}
</style>
