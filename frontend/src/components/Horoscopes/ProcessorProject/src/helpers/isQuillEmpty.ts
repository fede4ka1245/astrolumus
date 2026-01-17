const isQuillEmpty = (value: string): boolean => {
  if (value.replace(/<(.|\n)*?>/g, '').trim().length === 0 && !value.includes('<img')) {
    return true;
  }
  return false;
};

export default isQuillEmpty;
