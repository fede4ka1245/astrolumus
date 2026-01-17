import { IServerTopic } from './topic';

export interface IForumCategory {
  id: number;
  topics_count: number;
  title: string;
  parent: null | number;
  children?: IForumCategory[];
  parent_object?: IForumCategory,
  topics: IServerTopic []
}
