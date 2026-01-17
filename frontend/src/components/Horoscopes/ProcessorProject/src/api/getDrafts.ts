import authRequest from './authRequest';
import { forumTopicApi } from './forum';

export const getDrafts = (params: object) => {
  return authRequest.get(forumTopicApi(), {
    params: {
      not_published: true, 
      ...params
    } 
  });
};

export const getDraftById = (id: number, params: object) => {
  return authRequest.get(forumTopicApi(id), {
    params: {
      not_published: true, 
      ...params
    } 
  });
};
