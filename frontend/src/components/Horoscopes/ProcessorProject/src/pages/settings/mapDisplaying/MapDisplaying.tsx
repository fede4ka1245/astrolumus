import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import ButtonBack from '../../../components/buttonBack/ButtonBack';
import ButtonSave from '../../../components/buttonSave/ButtonSave';
import { useNavigate, useOutletContext } from '../../../contexts/NavigationContext';
import Button from '../../../components/button/Button';
import { ButtonType } from '../../../components/button/ButtonProps';
import { languages } from './helpers/languages';
import { mapStyles } from './helpers/mapStyles';
import { helpersElements } from './helpers/helpersElements';
import Options from '../../../components/options/Options';
import Divider from '../../../components/divider/Divider';
import Switch from '../../../components/switch/Switch';
import { useHideNavbar } from '../../../hooks/useHideNavbar';
import { useGetHelpersElements, useGetIsEarthActive, useGetLanguage, useGetMapType } from '../../../store/selectors';
import { useAppDispatch } from '../../../store/store';
import { Option } from '../../../models/types/Option';
import ConfirmationModal from '../confirmationModal/ConfirmationModal';
import { SettingsPageProps } from '../SettingsPageProps';
import lodash from 'lodash';
import {
  setHelpersElements,
  setLanguage,
  setIsEarthActive as setIsSettingsEarthActive,
  setMapType
} from '../../../store/reducers/settingsReducer';
import DarkThemeBackground from '../../../components/darkThemeBackground/DarkThemeBackground';
import { ProcessorContext } from '../../../models/interfaces/processorContext';
import { processorRoutes } from '../../astrlogicalProcessor/processorRoutes';

const MapDisplaying = ({ closeSettings, isModal }: SettingsPageProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [targetLanguage, setTargetLanguage] = useState<Option>(languages[0]);
  const [targetHelpers, setTargetHelpers] = useState(helpersElements);
  const [targetMapType, setTargetMapType] = useState<Option>(mapStyles[0]);
  const [isEarthActive, setIsEarthActive] = useState(false);

  const toggleIsEarthActive = useCallback((_: any, checked: boolean) => {
    setIsEarthActive(checked);
  }, []);

  const settingsMapType = useGetMapType();
  const settingsHelpersElements = useGetHelpersElements();
  const settingsIsEarthActive = useGetIsEarthActive();
  const settingsLanguage = useGetLanguage();

  useEffect(() => {
    if (!(settingsMapType && settingsHelpersElements && settingsIsEarthActive !== undefined && settingsLanguage)) {
      return;
    }

    const targetMapType = mapStyles.find((mapStyleOption) => mapStyleOption.value === settingsMapType) as Option;
    const targetHelpers = helpersElements.filter((helperElement) => settingsHelpersElements.includes(helperElement.value));
    const isEarthActive = settingsIsEarthActive;
    const targetLanguage = languages.find((lang) => lang.value === settingsLanguage) as Option;

    if (targetLanguage) {
      setTargetLanguage(targetLanguage);
    }

    if (targetHelpers) {
      setTargetHelpers(targetHelpers);
    }

    if (isEarthActive !== undefined) {
      setIsEarthActive(isEarthActive);
    }

    if (targetMapType) {
      setTargetMapType(targetMapType);
    }
  }, [settingsMapType, settingsHelpersElements, settingsIsEarthActive, settingsLanguage]);

  const isSettingChanged = useMemo(() => {
    return targetMapType.value !== settingsMapType || targetLanguage.value !== settingsLanguage || isEarthActive !== settingsIsEarthActive ||
      !lodash.isEqual([...targetHelpers.map((targetHelper) => targetHelper.value)].sort(), Array.from(settingsHelpersElements).sort());
  }, [settingsMapType, settingsLanguage, settingsIsEarthActive, settingsHelpersElements, targetLanguage, targetMapType, targetHelpers, isEarthActive]);

  const updateSettings = useCallback(() => {
    if (!isSettingChanged) {
      return;
    }

    dispatch(setIsSettingsEarthActive(isEarthActive));
    dispatch(setHelpersElements(Array.from(targetHelpers.map((targetHelper) => targetHelper.value))));
    dispatch(setMapType(targetMapType.value));
    dispatch(setLanguage(targetLanguage.value));
  }, [targetMapType, targetLanguage, targetHelpers, isEarthActive, isSettingChanged, dispatch]);
  const { route } = useOutletContext<ProcessorContext>();

  useHideNavbar();

  const close = useCallback(() => {
    if (closeSettings) {
      closeSettings();
      return;
    }

    navigate(route + processorRoutes.settings);
  }, [closeSettings, navigate, route]);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const toggleConfirmationModal = useCallback(() => {
    setIsConfirmationModalOpen(!isConfirmationModalOpen);
  }, [isConfirmationModalOpen]);

  const onButtonBackClick = useCallback(() => {
    if (!isSettingChanged) {
      close();
      return;
    }

    toggleConfirmationModal();
  }, [isConfirmationModalOpen, toggleConfirmationModal, isSettingChanged, close]);

  const onSaveClick = useCallback(() => {
    toggleConfirmationModal();
    updateSettings();
    close();
  }, [toggleConfirmationModal, close, updateSettings]);

  const onCancelClick = useCallback(() => {
    toggleConfirmationModal();
    close();
  }, [toggleConfirmationModal, close]);

  return (
    <DarkThemeBackground fillBody={!isModal}>
      <Grid height={'100%'}>
        <ConfirmationModal
          onSaveClick={onSaveClick}
          onCancelClick={onCancelClick}
          isOpen={isConfirmationModalOpen}
          close={toggleConfirmationModal}
        />
        <Grid container pr={2} pl={2} pt={4} rowSpacing={2}>
          <Grid item container alignItems={'center'} justifyContent={'space-between'}>
            <Grid item mt={2}>
              <ButtonBack label={'Настройки'} onClick={onButtonBackClick}/>
            </Grid>
            {isSettingChanged && <Grid item>
              <ButtonSave onClick={updateSettings}/>
            </Grid>}
          </Grid>
          <Grid item pt={2}>
            <Typography fontFamily={'Playfair Display'} fontWeight={'bold'} fontSize={24} color={'white'}
              textAlign={'left'}>
              Настройки отображения
            </Typography>
          </Grid>
          <Grid item container direction={'column'}>
            <Grid item>
              <Typography fontFamily={'Gilroy'} fontWeight={600} fontSize={16} color={'white'} textAlign={'left'}>
                Стиль начертания карты
              </Typography>
            </Grid>
            <Grid item pt={1}>
              <Options options={mapStyles} value={targetMapType.value} setValue={setTargetMapType}/>
            </Grid>
            <Grid item pt={2}>
              <Divider color={'#37366B'}/>
            </Grid>
          </Grid>
          <Grid item container direction={'column'}>
            <Grid item>
              <Typography fontFamily={'Gilroy'} fontWeight={600} fontSize={16} color={'white'} textAlign={'left'}>
                Язык наименований на карте
              </Typography>
            </Grid>
            <Grid item pt={1}>
              <Options options={languages} value={targetLanguage.value} setValue={setTargetLanguage}/>
            </Grid>
            <Grid item pt={2}>
              <Divider color={'#37366B'}/>
            </Grid>
          </Grid>
          <Grid item container direction={'column'}>
            <Grid item>
              <Typography fontFamily={'Gilroy'} fontWeight={600} fontSize={16} color={'white'} textAlign={'left'}>
                Вспомогательные элементы
              </Typography>
            </Grid>
            <Grid item pt={1}>
              <Options options={helpersElements} value={targetHelpers} setValue={setTargetHelpers}/>
            </Grid>
            <Grid item pt={2}>
              <Divider color={'#37366B'}/>
            </Grid>
          </Grid>
          <Grid item container direction={'column'}>
            <Grid item container direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
              <Grid item>
                <Typography fontFamily={'Gilroy'} fontWeight={600} fontSize={16} color={'white'} textAlign={'left'}>
                  Земля в дипскай объектах
                </Typography>
              </Grid>
              <Grid item>
                <Switch checked={isEarthActive} onChange={toggleIsEarthActive}/>
              </Grid>
            </Grid>
            <Grid item pt={2}>
              <Divider color={'#37366B'}/>
            </Grid>
          </Grid>
          {isSettingChanged && <Grid item width={'100%'} pb={2}>
            <Button type={ButtonType.gradient} onClick={updateSettings} text={'Сохранить изменения'}/>
          </Grid>}
        </Grid>
      </Grid>
    </DarkThemeBackground>
  );
};

export default MapDisplaying;
