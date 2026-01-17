const webPathToFile = async (image: string, fileName: string) => {
  const blob = await fetch(image).then(r => r.blob());
  const file = new File([blob], `${fileName}.${blob.type.slice(6)}`);
  return file;
};

export default webPathToFile;
