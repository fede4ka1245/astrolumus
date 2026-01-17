import { AccessLevel, CommentStatus, MemberStatus, TopicStatuses } from '../enums/topic';

export interface ITopicImage {
  id: number;
  creator: string;
  creator_id: number;
  created_at: Date;
  updated_at: Date;
  image: string;
  image_original: string;
}

export interface ILocalTopicImage {
  image: string;
  image_original: string;
}

export interface ITopicUser {
  id: number;
  first_name: string | null;
  last_name: string | null;
  avatar: string | null;
  birth_date: Date | null;
}

export interface IMember {
  created_at: Date;
  id: number;
  invite_reason: string | null;
  inviter: ITopicUser;
  status: MemberStatus;
  user_status: MemberStatus;
  topic: number;
  topic_title: string;
  updated_at: Date;
  user: ITopicUser;
}

export interface IServerTopic {
  id: number;
  title: string;
  description: string;
  access_level: AccessLevel;
  category: number;
  category_title: string;
  limited_members: IMember[];
  horoscope: number | null;
  created_at: Date;
  dim_sky: boolean;
  user: ITopicUser;
  status: TopicStatuses;
  comments_count: number;
  images: ITopicImage[];
  count_of_members: number;
  current_user_unread: boolean;
  current_user_is_member: boolean;
  likes_count: number;
  current_user_liked: boolean;
  current_user_favorite: boolean;
  current_user_sent_join: boolean;
  published_at: Date | null;
  horoscope_link?: string
}

export interface ILocalTopic {
  title: string;
  description: string;
  images_ids: number[];
  access_level: AccessLevel;
  category: number | null;
  members_ids: number[];
  category_name?: string,
  horoscope?: number | null;
  dim_sky?: boolean;
  published_at: Date | null;
  horoscope_link?: string | null
}

export interface ITopicComment {
  id: number;
  topic: number;
  text: string;
  likes_count: number;
  comment: ITopicComment | null;
  image: ITopicImage | null;
  created_at: Date;
  status: CommentStatus;
  comment_parent_page: number | null;
  updated_at: Date;
  user: ITopicUser;
  current_user_liked: boolean;
}
