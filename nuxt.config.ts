// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: false },

    ssr: true,

    runtimeConfig: {
        mongodbUri: process.env.MONGODB_URI,
        gcpServiceAccountKey: process.env.GCP_SERVICE_ACCOUNT_KEY,
    },

    css: ['~/assets/css/main.css'],

    modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', 'nuxt-lodash'],
});
