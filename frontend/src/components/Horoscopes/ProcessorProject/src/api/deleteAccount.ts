import authRequest from './authRequest';

export const deleteAccount = (id: number | string) => {
  return authRequest.delete(`${import.meta.env.VITE_APP_API_URL}/users/users/${id}`);
};
