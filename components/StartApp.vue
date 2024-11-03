<script setup>
import { useWebAppViewport } from 'vue-tg';

const { expand, disableVerticalSwipes } = useWebAppViewport();

disableVerticalSwipes();
expand();
</script>

<template></template>
