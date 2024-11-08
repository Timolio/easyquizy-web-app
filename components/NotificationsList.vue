<template>
    <div
        class="fixed bottom-2 left-4 flex flex-col-reverse space-y-2 space-y-reverse"
    >
        <Notification
            v-for="notification in notifications"
            :key="notification.id"
            :message="notification.message"
            :duration="notification.duration"
            @close="removeNotification(notification.id)"
        />
    </div>
</template>

<script setup>
const { notifications, removeNotification } = useNotificationStore();
</script>

<style scoped>
div {
    width: calc(100% - 1rem);
}
</style>
