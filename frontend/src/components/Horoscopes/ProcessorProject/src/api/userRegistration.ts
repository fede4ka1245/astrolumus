import axios from 'axios';

interface userRegistrationProps {
  name: string,
  secondName: string,
  email: string
}

export const userRegistration = ({ name, secondName, email }: userRegistrationProps) => {
  return axios.post(`${import.meta.env.VITE_APP_API_URL}/users/registration/`, {
    first_name: name,
    last_name: secondName,
    email
  });
};
