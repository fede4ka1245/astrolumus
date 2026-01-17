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
  certificates: IUserFile[];
  deleteFile: (id: number, type: UserFileTypes) => void;
  addFile: (file: ILocalUserFile) => void; 
}

const UserCertificate: FC<IProps> = ({ certificates, deleteFile, addFile }) => {
  const [isProfilePhotoEditorActive, setIsProfilePhotoEditorActive] = useState(false);
  const [file, setFile] = useState<ILocalUserFile>({
    file_type: UserFileTypes.certificate, 
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
        image: dataURLtoFile(imageBase64, 'certificate'),
        image_original: await webPathToFile(file.image_original, 'certificate_original')
      });
    };
    setIsProfilePhotoEditorActive(false);
  };

  return (
    <Grid container justifyContent={'space-between'}>
      {
        certificates.map((item, index) => (
          <Grid 
            key={item.id}
            mb={2} 
            sx={{ backgroundColor: '#c3c9cd' }} 
            height={'105px'} 
            position={'relative'}
            width={'calc(50% - 5px)'}>
            <Grid
              onClick={() => deleteFile(item.id, UserFileTypes.certificate)}
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
            <ImageZoom slide={index} images={certificates.map(item => item.image_original)}>
              <img src={item.image} height={'100%'} width={'100%'} style={{
                objectFit: 'contain'
              }} />
            </ImageZoom>
          </Grid>
        ))
      }
      <Grid 
        onClick={onChangePhotoClick}
        sx={{ backgroundColor: '#c3c9cd' }} 
        display={'flex'} 
        justifyContent={'center'} 
        alignItems={'center'} 
        borderRadius={'5px'} 
        height={'105px'} 
        width={'calc(50% - 5px)'}>
        <img src={plus} height={64} width={64} />
      </Grid>
      {isProfilePhotoEditorActive &&
        <AvatarPicker
          minCropBoxHeight={210}
          minCropBoxWidth={330}
          imagePath={typeof file.image_original === 'string' ? file.image_original : ''}
          cancel={() => setIsProfilePhotoEditorActive(false)}
          save={onSave}
        />
      }
    </Grid>
  );
};

export default UserCertificate;
