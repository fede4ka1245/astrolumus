import { UserFileTypes } from '../models/enums/user';
import { IUserFile } from '../models/interfaces/user';
import authRequest from './authRequest';
import { userFilesApi } from './user';

interface IParams {
  fileType: UserFileTypes,
  user: number
}

export const getUserFiles = async ({ fileType, user }: IParams): Promise<IUserFile[]> => {
  const res = await authRequest.get(userFilesApi(), { 
    params: {
      file_type: fileType,
      user
    } 
  });
  return res.data.results;
};
