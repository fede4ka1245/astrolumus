export const notificationsApi = (id?: number): string => {
  if (id) {
    return `${import.meta.env.VITE_APP_API_URL}/notifications/notifications/${id}/`;
  }
  return `${import.meta.env.VITE_APP_API_URL}/notifications/notifications/`;
};

export const notificationsMarkAllAsReadApi = (): string => {
  return `${import.meta.env.VITE_APP_API_URL}/notifications/notifications/mark-all-as-read/`;
};
