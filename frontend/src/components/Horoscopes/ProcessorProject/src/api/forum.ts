export const forumCategoryApi = (id?:number):string => {
  if (id) {
    return `${import.meta.env.VITE_APP_API_URL}/forum/categories/${id}/`;
  }
  return `${import.meta.env.VITE_APP_API_URL}/forum/categories/`;
};

export const forumTopicApi = (id?: number): string => {
  if (id) {
    return `${import.meta.env.VITE_APP_API_URL}/forum/topics/${id}/`;
  }
  return `${import.meta.env.VITE_APP_API_URL}/forum/topics/`;
};

export const forumTopicArchiveApi = (id: number): string => {
  return `${import.meta.env.VITE_APP_API_URL}/forum/topics/${id}/archive/`;
};

export const forumTopicRestoreArchiveApi = (id: number): string => {
  return `${import.meta.env.VITE_APP_API_URL}/forum/topics/${id}/archive-restore/`;
};

export const forumCommentApi = (id?: number): string => {
  if (id) {
    return `${import.meta.env.VITE_APP_API_URL}/forum/comments/${id}/`;
  }
  return `${import.meta.env.VITE_APP_API_URL}/forum/comments/`;
};

export const forumCommentFavorite = (id: number): string => {
  return `${import.meta.env.VITE_APP_API_URL}/forum/topics/${id}/favorite/`;
};

export const forumTopicFavorite = (id: number): string => {
  return `${import.meta.env.VITE_APP_API_URL}/forum/topics/${id}/like/`;
};

export const forumCommentLike = (id: number): string => {
  return `${import.meta.env.VITE_APP_API_URL}/forum/comments/${id}/like/`;
};

export const forumReportCommentApi = (id: number): string => {
  return `${import.meta.env.VITE_APP_API_URL}/forum/comments/${id}/complaint/`;
};

export const forumSearch = (): string => {
  return `${import.meta.env.VITE_APP_API_URL}/forum/topics/search/`;
};

export const forumImage = (id?: number): string => {
  if (id) {
    return `${import.meta.env.VITE_APP_API_URL}/forum/images/${id}/`;
  }
  return `${import.meta.env.VITE_APP_API_URL}/forum/images/`;
};

export const forumRulesApi = (): string => {
  return `${import.meta.env.VITE_APP_API_URL}/forum/rules/`;
};

export const forumTopicJoinApi = (): string => {
  return `${import.meta.env.VITE_APP_API_URL}/forum/topics/join/`;
};

export const forumTopicAcceptApi = (id: number): string => {
  return `${import.meta.env.VITE_APP_API_URL}/forum/topics/${id}/accept/`;
};

export const forumTopicLeaveApi = (id: number): string => {
  return `${import.meta.env.VITE_APP_API_URL}/forum/topics/${id}/leave/`;
};

export const forumTopicMembersApi = (id?: number): string => {
  if (id) {
    return `${import.meta.env.VITE_APP_API_URL}/forum/topics-members/${id}/`;
  }
  return `${import.meta.env.VITE_APP_API_URL}/forum/topics-members/`;
};

export const forumTopicRemoveMemberApi = (id: number): string => {
  return `${import.meta.env.VITE_APP_API_URL}/forum/topics/${id}/remove/`;
};
