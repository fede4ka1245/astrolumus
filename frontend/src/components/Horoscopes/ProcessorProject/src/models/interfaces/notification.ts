import { NotificationLevel, NotificationVerb } from '../enums/Notification';

export interface IUser {
  id: number
  avatar: string
  first_name: string
  nickname: string
  patronymic: string
  last_name: string
  likes_count: number
  birth_date: string
}

export interface INotification {
  id: number;
  action_object: IUser;
  actor: IUser;
  data: null;
  description: null | string;
  level: NotificationLevel;
  recipient: IUser;
  target: null | any;
  timestamp: Date;
  unread: boolean;
  verb: NotificationVerb;
};
