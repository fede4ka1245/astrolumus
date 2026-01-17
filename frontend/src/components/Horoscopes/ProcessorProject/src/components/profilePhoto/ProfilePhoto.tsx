import { useState, FC, useCallback } from 'react';
import styles from './ProfilePhoto.module.scss';
import edit from './images/edit.svg';
import plus from './images/plus.svg';
import AvatarPicker from '../avatarPicker/AvatarPicker';
import { pickImage } from '../../helpers/pickImage';

interface IProps {
  avatar: any;
  onSelectAvatar: (avatar: any) => void;
}

const ProfilePhoto: FC<IProps> = ({ avatar, onSelectAvatar }) => {
  const [isProfilePhotoEditorActive, setIsProfilePhotoEditorActive] = useState(false);
  const [imagePath, setImagePath] = useState('');

  const onChangePhotoClick = useCallback(async () => {
    const image = await pickImage();

    if (!image) {
      return;
    }

    setIsProfilePhotoEditorActive(true);
    setImagePath(image);
  }, []);

  const onSave = useCallback((imageBase64: string) => {
    setIsProfilePhotoEditorActive(false);
    onSelectAvatar(imageBase64);
  }, [onSelectAvatar]);

  return (
    <>
      <div className={styles.outline} onClick={onChangePhotoClick}>
        <div className={styles.outlineImage}>
          {avatar && <img src={avatar} width={'100%'} height={'100%'} style={{ opacity: 10 }}/>}
        </div>
        {avatar && <img src={edit} className={styles.imageEdit}/>}
        {!avatar && <img src={plus} className={styles.plus}/>}
      </div>
      {isProfilePhotoEditorActive &&
        <AvatarPicker
          imagePath={imagePath}
          cancel={() => setIsProfilePhotoEditorActive(false)}
          save={onSave}
        />
      }
    </>
  );
};

export default ProfilePhoto;
