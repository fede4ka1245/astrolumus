export const userInfoApi = () => {
  return `${import.meta.env.VITE_APP_API_URL}/users/users/me/`; 
};

export const reportUserApi = (id: number) => {
  return `${import.meta.env.VITE_APP_API_URL}/users/users/${id}/complaint/`;
};

export const userProfileOpenInfo = (id: number) => {
  return `${import.meta.env.VITE_APP_API_URL}/users/user-profile-open-info/${id}/`; 
};

export const userProfileApi = (id?: number) => {
  if (id) {
    return `${import.meta.env.VITE_APP_API_URL}/users/user-profile/${id}/`; 
  }
  return `${import.meta.env.VITE_APP_API_URL}/users/user-profile/`; 
};

export const userFilesApi = (id?: number) => {
  if (id) {
    return `${import.meta.env.VITE_APP_API_URL}/users/user-files/${id}/`; 
  }
  return `${import.meta.env.VITE_APP_API_URL}/users/user-files/`;
};

export const usersListApi = (id?: number) => {
  if (id) {
    return `${import.meta.env.VITE_APP_API_URL}/users/users/${id}/`; 
  }
  return `${import.meta.env.VITE_APP_API_URL}/users/users/`; 
};

export const userFriendsApi = () => {
  return `${import.meta.env.VITE_APP_API_URL}/users/friends/`; 
};

export const userSubscriptionsApi = () => {
  return `${import.meta.env.VITE_APP_API_URL}/users/subscriptions/`;
};

export const userUnsubscribeApi = () => {
  return `${import.meta.env.VITE_APP_API_URL}/users/subscriptions/delete/`;
};

export const userLikesApi = (id: number) => {
  return `${import.meta.env.VITE_APP_API_URL}/users/users/${id}/like/`;
};
