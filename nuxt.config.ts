// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },

    ssr: true,

    runtimeConfig: {
        mongodbUri: process.env.MONGODB_URI,
    },

    css: ['~/assets/css/main.css'],

    modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', 'nuxt-lodash'],

    build: {
        transpile: ['pinia'],
    },
});
