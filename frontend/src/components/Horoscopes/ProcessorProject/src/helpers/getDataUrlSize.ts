export const getDataUrlSize = (dataUrl: string): number => {
  const head = 'data:image/png;base64,';
  return (Math.round(dataUrl.length - head.length) * 3 / 4) / 1024 / 1024;
};
