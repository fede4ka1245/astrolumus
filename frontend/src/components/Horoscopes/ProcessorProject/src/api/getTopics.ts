import authRequest from './authRequest';
import { forumTopicApi } from './forum';

export const getTopics = (params: object) => {
  return authRequest.get(forumTopicApi(), {
    params: {
      ...params,
      not_published: false, 
      page_size: 4
    } 
  });
};

export const getTopicById = (id: number, params?: object) => {
  return authRequest.get(forumTopicApi(id), {
    params: {
      not_published: false, 
      ...params
    } 
  });
};
