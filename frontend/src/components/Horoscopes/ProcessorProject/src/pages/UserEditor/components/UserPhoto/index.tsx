import { FC, useState } from 'react';
import { Button as MuiButton, Grid, Typography } from '@mui/material';
import { Camera, GalleryPhotos } from '@capacitor/camera';

import { ILocalUserFile, IUserFile } from '../../../../models/interfaces/user';
import { UserFileTypes } from '../../../../models/enums/user';

import plus from '../../assets/plus.png';
import AvatarPicker from '../../../../components/avatarPicker/AvatarPicker';
import dataURLtoFile from '../../../../helpers/dataURLtoFile';
import webPathToFile from '../../../../helpers/webPathToFile';
import ImageZoom from '../../../../hoc/ImageZoom';
import { pickImage } from '../../../../helpers/pickImage';

interface IProps {
  photos: IUserFile[];
  addFile: (file: ILocalUserFile) => void; 
  deleteFile: (id: number, type: UserFileTypes) => void;
};

const UserPhoto: FC<IProps> = ({ photos, deleteFile, addFile }) => {
  const [isProfilePhotoEditorActive, setIsProfilePhotoEditorActive] = useState(false);
  const [file, setFile] = useState<ILocalUserFile>({
    file_type: UserFileTypes.photo, 
    image: '',
    image_original: ''
  });

  const onChangePhotoClick = async () => {
    const image = await pickImage();

    if (!image) {
      return;
    }

    setIsProfilePhotoEditorActive(true);
    setFile(prev => ({ ...prev, image_original: image }));
  };

  const onSave = async (imageBase64: string) => {
    if (typeof file.image_original === 'string') {
      addFile({
        ...file,
        image: dataURLtoFile(imageBase64, 'photo'),
        image_original: await webPathToFile(file.image_original, 'photo_original')
      });
    };
    setIsProfilePhotoEditorActive(false);
  };

  return (
    <Grid container>
      {
        photos.map((item, index) => (
          <Grid 
            key={item.id}
            mb={2} 
            mr={0.7}
            sx={{ backgroundColor: '#c3c9cd' }} 
            borderRadius={'5px'} 
            height={'180px'} 
            position={'relative'}
            width={'calc(33% - 5px)'}>
            <Grid
              onClick={() => deleteFile(item.id, UserFileTypes.photo)}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              position={'absolute'}
              right={'-7px'}
              top={'-7px'}
              width={'15px'}
              height={'15px'}
              borderRadius={'50%'}
              bgcolor={'#ABB0B2'}>
              <svg width="7" height="7" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 1.5L12.5 12.5" stroke="#FFF" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12.5 1.5L1.5 12.5" stroke="#FFF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Grid>
            <ImageZoom slide={index} images={photos.map(item => item.image_original)}>
              <img src={item.image} height={'100%'} width={'100%'} style={{
                objectFit: 'contain'
              }} />
            </ImageZoom>

          </Grid>
        ))
      }
      {
        photos.length < 5 && (
          <Grid 
            onClick={onChangePhotoClick}
            sx={{ backgroundColor: '#c3c9cd' }} 
            display={'flex'} 
            justifyContent={'center'} 
            alignItems={'center'} 
            borderRadius={'5px'} 
            height={'180px'} 
            width={'calc(33% - 5px)'}>
            <img src={plus} height={64} width={64} />
          </Grid>
        )
      }
      {isProfilePhotoEditorActive &&
        <AvatarPicker
          imagePath={typeof file.image_original === 'string' ? file.image_original : ''}
          minCropBoxHeight={345}
          minCropBoxWidth={247.5}
          cancel={() => setIsProfilePhotoEditorActive(false)}
          save={onSave}
        />
      }
    </Grid>
  );
};

export default UserPhoto;
