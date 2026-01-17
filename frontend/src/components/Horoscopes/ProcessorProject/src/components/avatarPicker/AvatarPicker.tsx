import React, { useCallback, useRef } from 'react';
import { Grid } from '@mui/material';
import Button from '../button/Button';
import { ButtonType } from '../button/ButtonProps';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { useHideNavbar } from '../../hooks/useHideNavbar';
import { useLockScroll } from '../../hooks/useLockScroll';

interface AvatarPickerProps {
  imagePath: string,
  cancel: () => any;
  minCropBoxHeight?:number;
  minCropBoxWidth?:number;
  save: (imageBase64: string) => any;
}

const AvatarPicker = ({ imagePath, cancel, save, minCropBoxWidth, minCropBoxHeight }: AvatarPickerProps) => {
  const imgRef = useRef<HTMLImageElement>(null);

  const onInit = useCallback(() => {
    setTimeout(() => {
      if (imgRef.current) {
        (imgRef.current as any)?.cropper.setCropBoxData({
          left: minCropBoxWidth ? window.innerWidth / 2 - (minCropBoxWidth / 2) : window.innerWidth / 2 - 150,
          top: window.innerHeight / 2 - (minCropBoxWidth || 300),
          width: minCropBoxWidth || 300,
          height: minCropBoxHeight || 300
        });
      }
    }, 250);
  }, [minCropBoxHeight, minCropBoxWidth]);

  useLockScroll();
  useHideNavbar();

  const onSave = useCallback(() => {
    if (imgRef.current) {
      const cropper = (imgRef.current as any)?.cropper;

      const res = cropper.getCroppedCanvas({
        width: minCropBoxWidth || 300,
        height: minCropBoxHeight || 300,
        fillColor: 'black'
      }).toDataURL();

      save(res);
    }
  }, [minCropBoxHeight, minCropBoxWidth, save]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 10, background: 'black', width: '100%', height: '100%' }}>
      <Cropper
        src={imagePath}
        style={{ height: '100%', width: '100%', background: 'black' }}
        initialAspectRatio={1}
        guides={false}
        ref={imgRef}
        cropBoxResizable={false}
        minCropBoxHeight={minCropBoxHeight || 300}
        minCropBoxWidth={minCropBoxWidth || 300}
        cropBoxMovable={false}
        onInitialized={onInit}
        dragMode={'move'}
        background={false}
      />
      <Grid container direction={'column'} rowSpacing={2} position={'absolute'} bottom={2} width={'100%'} p={'15px'} zIndex={2}>
        <Grid item>
          <Button text={'Сохранить'} onClick={onSave}/>
        </Grid>
        <Grid item>
          <Button text={'Отменить'} type={ButtonType.outline} onClick={cancel}/>
        </Grid>
      </Grid>
    </div>
  );
};

export default AvatarPicker;
