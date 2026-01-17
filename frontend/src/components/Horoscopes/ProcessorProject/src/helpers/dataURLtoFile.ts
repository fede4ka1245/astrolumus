const dataURLtoFile = (dataurl: string | null, filename: string) => {
  try {
    if (dataurl) {
      const arr: any = dataurl.split(',');
      const mime = arr[0]?.match(/:(.*?);/)[1];
      const bstr = atob(arr[1]); 
      let n = bstr.length; 
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      
      return new File([u8arr], `${filename}.${mime.slice(6)}`, { type: mime });
    }
    return '';
  } catch (error) {
    console.log(error);
    return '';
  };
};

export default dataURLtoFile;
