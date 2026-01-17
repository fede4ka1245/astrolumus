import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Modal from '../../../../components/modal/Modal';
import { Grid } from '@mui/material';
import HoroscopeForm from '../../../../components/horoscopeForm/HoroscopeForm';
import { useGetHoroscopeAddressInformation, useGetHoroscopeUserInfo } from '../../../../store/selectors';
import { setHoroscopeUserInfo, setProcessorTargetRoute } from '../../../../store/reducers/horoscopesReducer';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { useLoadHoroscopes } from '../../../../hooks/useLoadHororscope';
import { HoroscopeAddress } from '../../../../models/types/HoroscopeAddress';
import DarkThemeBackground from '../../../../components/darkThemeBackground/DarkThemeBackground';
import { setIsDeepSkyActive } from '../../../../store/reducers/deepSkyReducer';
import { resetVarshpahala } from '../../../../store/reducers/varshpahalaReducer';
import { resetRectification } from '../../../../store/reducers/rectificationReducer';
import { useNavigate, useOutletContext } from '../../../../contexts/NavigationContext';
import { processorRoutes } from '../../../astrlogicalProcessor/processorRoutes';
import { ProcessorContext } from '../../../../models/interfaces/processorContext';
import { getProcessorRoutes } from '../../logic/getProcessorRoutes';

interface EditHoroscopeModalProps {
  isEditModalOpen: boolean,
  toggleEditModal: (props?: any) => any
}

const EditHoroscopeModal = ({ isEditModalOpen, toggleEditModal }: EditHoroscopeModalProps) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [addressInformation, setAddressInformation] = useState<HoroscopeAddress>({
    timeZone: {
      hours: '',
      minutes: '',
      greenwich: ''
    },
    coordinates: {
      longitude: '',
      latitude: ''
    },
    location: {
      value: '',
      key: ''
    }
  });
  const dispatch = useAppDispatch();
  const loadHoroscopes = useLoadHoroscopes();
  const horoscopeUserInfo = useGetHoroscopeUserInfo();
  const horoscopeAddressInformation = useGetHoroscopeAddressInformation();

  useEffect(() => {
    setName(horoscopeUserInfo.name);
    setDate(horoscopeUserInfo.date);
    setTime(horoscopeUserInfo.time);
    setAddressInformation(horoscopeAddressInformation);
  }, []);

  const isHoroscopeCountingDataChanged = useMemo(() => {
    return horoscopeUserInfo.date !== date || horoscopeUserInfo.time !== time ||
      horoscopeAddressInformation.timeZone.hours !== addressInformation.timeZone.hours || horoscopeAddressInformation.timeZone.minutes !== addressInformation.timeZone.minutes || horoscopeAddressInformation.timeZone.greenwich !== addressInformation.timeZone.greenwich ||
      horoscopeAddressInformation.coordinates.latitude !== addressInformation.coordinates.latitude || horoscopeAddressInformation.coordinates.longitude !== addressInformation.coordinates.longitude;
  }, [horoscopeUserInfo, date, time, addressInformation]);

  const isHoroscopeDataChanged = useMemo(() => {
    return horoscopeUserInfo.name !== name || horoscopeUserInfo.date !== date || horoscopeUserInfo.time !== time ||
      horoscopeAddressInformation.timeZone.hours !== addressInformation.timeZone.hours || horoscopeAddressInformation.timeZone.minutes !== addressInformation.timeZone.minutes || horoscopeAddressInformation.timeZone.greenwich !== addressInformation.timeZone.greenwich ||
      horoscopeAddressInformation.coordinates.latitude !== addressInformation.coordinates.latitude || horoscopeAddressInformation.coordinates.longitude !== addressInformation.coordinates.longitude;
  }, [horoscopeUserInfo, name, date, time, addressInformation]);

  const settings = useAppSelector((state) => state?.horoscopeSettings);
  const navigate = useNavigate();
  const { route } = useOutletContext<ProcessorContext>();

  const onCountHoroscopeClick = useCallback(() => {
    dispatch(setHoroscopeUserInfo({
      name,
      date,
      time
    }));

    if (!isHoroscopeCountingDataChanged) {
      toggleEditModal();
      return;
    }

    loadHoroscopes({
      userInfo: {
        name,
        date,
        time
      },
      address: addressInformation,
      settings,
      isCaching: false,
      resetHoroscopeData: false
    }).then(() => {
      dispatch(setIsDeepSkyActive(false));
      dispatch(resetVarshpahala());
      dispatch(resetRectification());
      dispatch(setProcessorTargetRoute(getProcessorRoutes(route)[0]));
      navigate(route + processorRoutes.horoscopes, {
        replace: true
      });
    });
    
    toggleEditModal();
  }, [settings, name, date, time, addressInformation, toggleEditModal, isHoroscopeCountingDataChanged, loadHoroscopes]);

  return (
    <Modal isDark isOpen={isEditModalOpen} close={toggleEditModal} height={'var(--modal-page-height)'}>
      <DarkThemeBackground>
        <Grid item ml={2} pr={2} pt={3} mb={4}>
          <HoroscopeForm
            name={name}
            setName={setName}
            date={date}
            setDate={setDate}
            time={time}
            setTime={setTime}
            addressInformation={addressInformation}
            setAddressInformation={setAddressInformation}
            horoscopeCountButtonText={'Пересчитать гороскоп'}
            onCountHoroscopeClick={onCountHoroscopeClick}
            isCountHoroscopeButtonDisabled={!isHoroscopeDataChanged}
            isFormDisabled={false}
          />
        </Grid>
      </DarkThemeBackground>
    </Modal>
  );
};

export default EditHoroscopeModal;
