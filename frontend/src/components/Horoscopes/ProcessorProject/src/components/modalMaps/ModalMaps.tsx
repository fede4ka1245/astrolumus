import React, { useCallback, useRef, useState } from 'react';
import Modal from '../modal/Modal';
import { ModalProps } from '../modal/ModalProps';
import { Map } from '@pbe/react-yandex-maps';
import Placemark from './mapPlacemark/Placemark';
import styles from './ModalMaps.module.scss';
import { CircularProgress, Grid, Paper } from '@mui/material';
import IconButton from '../iconButton/IconButton';
import Input from '../input/Input';
import { InputStyle } from '../input/InputStyle';
import Button from '../button/Button';
import ButtonClose from '../buttonClose/ButtonClose';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { Geolocation } from '@capacitor/geolocation';
import useLocalStorage from 'use-local-storage';

interface ModalMapsProps extends ModalProps {
  setCoordinates: (coordinates: number []) => any;
}

const ModalMaps = ({ isOpen, close, setCoordinates }: ModalMapsProps) => {
  const [isDragging, setIsDragging] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [center, setCenter] = useLocalStorage('yandex-map-center', [55.75, 37.57]);
  const mapRef = useRef<any>();

  const onInit = useCallback((map: any) => {
    if (!map) {
      return;
    }

    mapRef.current = map;

    map.events.add('actionbegin', function (event: any) {
      setCenter(event.originalEvent.map.getCenter());
      setIsDragging(true);
    });

    map.events.add('actionend', function (event: any) {
      setCenter(event.originalEvent.map.getCenter());
      setIsDragging(false);
    });
  }, [setCenter]);

  const onSaveButtonClick = useCallback(() => {
    setCoordinates(center);
    close();
  }, [setCoordinates, center, close]);

  const onLocationClick = useCallback(async () => {
    if (!mapRef.current?.setCenter) {
      return;
    }

    setIsLoading(true);

    try {
      const coordinates = await Geolocation.getCurrentPosition();
      mapRef.current.setCenter([coordinates.coords.latitude, coordinates.coords.longitude]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <Modal height={'var(--modal-page-height)'} isOpen={isOpen} close={close}>
      <Grid display={'flex'} flexDirection={'column'} height={'100%'}>
        <Grid container display={'flex'} flexDirection={'row'} p={2}>
          <Grid item flex={1}>
            <Input placeholder={'Широта'} inputStyle={InputStyle.outlined} disabled value={String(center[0].toFixed(2))}/>
          </Grid>
          <Grid item flex={1} pl={1}>
            <Input placeholder={'Долгота'} inputStyle={InputStyle.outlined} disabled value={String(center[1].toFixed(2))}/>
          </Grid>
          <Grid pl={1} display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'}>
            <ButtonClose onClick={close}/>
          </Grid>
        </Grid>
        <Grid item container position={'relative'} width={'100%'} height={'100%'} borderRadius={'20px'} overflow={'hidden'}>
          {isLoading && <Grid zIndex={200} width={'30px'} height={'30px'} position={'absolute'} left={'calc(50% - 15px)'} top={'calc(50% - 15px)'}>
            <CircularProgress sx={{ color: '#37366B' }}/>
          </Grid>}
          <Grid zIndex={300} position={'absolute'} right={'10px'} bottom={'20px'}>
            <IconButton onClick={onLocationClick}>
              <Paper sx={{ width: '53px', height: '53px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%' }}>
                <MyLocationIcon />
              </Paper>
            </IconButton>
          </Grid>
          <Map
            width={'100%'}
            height={'100%'}
            onLoad={() => setIsLoading(false)}
            instanceRef={onInit}
            defaultState={{ center, zoom: 9 }}
          >
            <div className={styles.placemark}>
              <Placemark isDragging={isDragging} />
            </div>
          </Map>
        </Grid>
        <Grid item m={2}>
          <Button text={'Сохранить'} onClick={onSaveButtonClick} />
        </Grid>
      </Grid>
    </Modal>
  );
};

export default ModalMaps;
