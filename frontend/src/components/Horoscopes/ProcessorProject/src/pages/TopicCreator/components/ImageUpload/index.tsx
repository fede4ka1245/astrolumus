import { useRef, useState, FC, MutableRefObject, useCallback } from 'react';
import { Grid } from '@mui/material';
// @ts-ignore
import AvatarEditor from 'react-avatar-editor';

// redux
import { useDispatch } from 'react-redux';
import { setIsAppLoading } from '../../../../store/reducers/preferencesReducer';

import Modal from '../../../../components/modal/Modal';
import { ModalProps } from '../../../../components/modal/ModalProps';
import Button from '../../../../components/button/Button';

// styles
import styles from './styles.module.scss';
import authRequest from '../../../../api/authRequest';
import { forumImage } from '../../../../api/forum';

interface IProps extends ModalProps {
  isOpen: boolean;
  image: string;
  close: () => void;
  onChange: (image: any) => void;
}

const ImageModal: FC <IProps> = ({ isOpen, close, image, onChange }) => {
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
  const windowWidth = useRef(window.innerWidth);
  const imageRef = useRef<any>();
  const [scale, setScale] = useState<any>(1);
  const dispatch = useDispatch();

  const handleScale = (e: any) => {
    const scale = parseFloat(e.target.value);
    setScale(scale);
  };

  const convertCanvasToFile = useCallback((canvas: HTMLCanvasElement, fileName: string): Promise<File> => {
    return new Promise(resolve => {
      canvas.toBlob((blob: any) => {
        const file = new File([blob], fileName, { type: 'image/png' });
        resolve(file);
      }, 'image/png');
    });
  }, []);

  const sendImage = useCallback(() => {
    const canvasScaled = imageRef.current;
    convertCanvasToFile(canvasScaled.getImageScaledToCanvas(), canvasScaled.props.image.type.replace('/', '.'))
      .then(file => {
        const formData = new FormData();
        formData.append('image', file);
        dispatch(setIsAppLoading(true));
        authRequest.post(forumImage(), formData, {
          headers: { 
            'Content-Type': 'multipart/form-data'
          }
        })
          .then((res) => {
            onChange(res.data);
            close();
          })
          .finally(() => {
            dispatch(setIsAppLoading(false));
          });
      });
  }, [close, convertCanvasToFile, dispatch, onChange]);

  return (
    <Modal isOpen={isOpen} close={close} height={'60vh'}>
      <Grid height={'100%'} sx={{ background: 'white' }} display={'flex'} flexDirection={'column'}>
        <Grid flex={1}>
          <AvatarEditor
            ref={imageRef}
            scale={parseFloat(scale)}
            width={windowWidth.current / 1.18}
            height={windowWidth.current / 1.18}
            position={position}
            onPositionChange={setPosition}
            borderRadius={10}
            image={image}
            className="editor-canvas"
          />
        </Grid>

        {/* <input
          name="scale"
          type="range"
          onChange={handleScale}
          min="0.5"
          max="2"
          step="0.01"
          defaultValue="1"
        /> */}
        <Grid item pl={6} pr={6} mb={10}>
          <Button text={'Добавить изображение'} onClick={sendImage}/>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default ImageModal;
