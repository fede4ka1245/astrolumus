import axios from 'axios';

interface UserGenerateLoginCode {
  email: string;
}

export const userGenerateLoginCode = ({ email }: UserGenerateLoginCode) => {
  return axios.post(`${import.meta.env.VITE_APP_API_URL}/users/generate-login-code/`, {
    email
  });
};
