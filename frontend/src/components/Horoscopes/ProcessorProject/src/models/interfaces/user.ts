import { UserFileTypes } from '../enums/user';

export interface IUserOpenInfo {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  likes_count: number;
  avatar: string | null;
  birth_date: string | null;
  about: string;
  subscribers_count: number;
  current_user_liked: boolean;
  current_user_subscribed: boolean;
};

export interface IUserMe {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  likes_count: number;
  avatar: string | null ;
  birth_date: string | null;
  about: string;
}

export interface IUserProfile {
  id: number;
  user: number;
  first_name: string;
  last_name: string;
  email: string;
  likes_count: number;
  subscribers_count: number;
  avatar: string | null ;
  birth_date: string | null;
  about: string;
};

export interface IUserFile {
  id: number;
  user: number;
  image: string;
  image_original: string;
  file_type: UserFileTypes;
}

export interface ILocalUserFile {
  image: string | File;
  image_original: string | File;
  file_type: UserFileTypes;
}
