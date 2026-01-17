import axios from 'axios';

interface userRegistrationProps {
  email: string;
  password: string;
}

export const userValidateLoginCode = ({ email, password }: userRegistrationProps) => {
  return axios.post(`${import.meta.env.VITE_APP_API_URL}/users/validate-login-code/`, {
    email,
    password: Number(password)
  });
};
