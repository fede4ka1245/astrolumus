import { Camera, CameraResultType } from '@capacitor/camera';
import { getDataUrlSize } from './getDataUrlSize';

export const pickImage = async () => {
  const photo = await Camera.getPhoto({
    quality: 100,
    resultType: CameraResultType.DataUrl
  });

  if (getDataUrlSize(photo.dataUrl || '') > 12) {
    alert('Вес изображения привышает лимит в 12мб!');
    throw new Error('File to large');
  }

  return photo.dataUrl;
};
