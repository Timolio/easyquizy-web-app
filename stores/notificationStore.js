export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: [],
    }),
    actions: {
        addNotification(message, duration = 5000) {
            const id = Date.now();
            this.notifications.unshift({ id, message, duration });

            setTimeout(() => {
                this.removeNotification(id);
            }, duration);
        },

        removeNotification(id) {
            const index = this.notifications.findIndex(
                notification => notification.id === id
            );
            if (index !== -1) this.notifications.splice(index, 1);
        },
    },
});
