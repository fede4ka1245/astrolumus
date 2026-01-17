export const documentApi = (code: string) => {
  return `${import.meta.env.VITE_APP_API_URL}/info/documents/${code}/`;
};
