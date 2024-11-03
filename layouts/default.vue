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
        </ClientOnly>
    </main>
</template>

<style>
main {
    height: 100vh;
    padding: 0.8rem 1rem;
}
</style>
