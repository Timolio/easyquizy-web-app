<script setup>
import { useWebAppViewport, useWebAppTheme } from 'vue-tg';

const { expand, disableVerticalSwipes } = useWebAppViewport();
const { setHeaderColor, themeParams } = useWebAppTheme();

setHeaderColor(themeParams.value.secondary_bg_color);
disableVerticalSwipes();
expand();

const root = document.documentElement;
const style = window.getComputedStyle(root);

root.style.setProperty(
    '--tg-theme-button-ttcolor',
    addAlpha(style.getPropertyValue('--tg-theme-button-color') || '', 0.3)
);
root.style.setProperty(
    '--tg-theme-button-tcolor',
    addAlpha(style.getPropertyValue('--tg-theme-button-color') || '', 0.5)
);

root.style.setProperty(
    '--tg-theme-button-ttcolor',
    addAlpha(style.getPropertyValue('--tg-theme-button-color') || '', 0.1)
);
root.style.setProperty(
    '--tg-theme-button-lcolor',
    adjust(style.getPropertyValue('--tg-theme-button-color') || '', 70)
);
root.style.setProperty(
    '--tg-theme-button-ltcolor',
    addAlpha(style.getPropertyValue('--tg-theme-button-lcolor') || '', 0.5)
);
root.style.setProperty(
    '--tg-theme-button-dcolor',
    adjust(style.getPropertyValue('--tg-theme-button-color') || '', -10)
);
root.style.setProperty(
    '--tg-theme-button-ddcolor',
    adjust(style.getPropertyValue('--tg-theme-button-dcolor') || '', -20)
);
root.style.setProperty(
    '--tg-theme-bg-tcolor',
    addAlpha(style.getPropertyValue('--tg-theme-bg-color') || '', 0.5)
);
root.style.setProperty(
    '--tg-theme-button-llcolor',
    adjust(style.getPropertyValue('--tg-theme-button-color') || '', 160)
);
root.style.setProperty(
    '--tg-theme-section-bg-dcolor',
    adjust(style.getPropertyValue('--tg-theme-section-bg-color') || '', -6)
);
root.style.setProperty(
    '--tg-theme-section-bg-tcolor',
    addAlpha(style.getPropertyValue('--tg-theme-section-bg-dcolor') || '', 0.5)
);
root.style.setProperty(
    '--tg-theme-text-ttcolor',
    addAlpha(style.getPropertyValue('--tg-theme-text-color') || '', 0.5)
);

document.body.style.backgroundColor = style.getPropertyValue(
    '--tg-theme-secondary-bg-color'
);
</script>

<template></template>
