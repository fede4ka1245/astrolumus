import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormControlLabel, Grid, RadioGroup, Typography } from '@mui/material';
import ButtonBack from '../../../components/buttonBack/ButtonBack';
import { useNavigate, useOutletContext } from '../../../contexts/NavigationContext';
import ButtonSave from '../../../components/buttonSave/ButtonSave';
import Button from '../../../components/button/Button';
import { ButtonType } from '../../../components/button/ButtonProps';
import Divider from '../../../components/divider/Divider';
import Radio from '../../../components/radio/Radio';
import FormLabel from '../../../components/formLabel/FormLabel';
import { useHideNavbar } from '../../../hooks/useHideNavbar';
import { SettingsPageProps } from '../SettingsPageProps';
import ConfirmationModal from '../confirmationModal/ConfirmationModal';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { ArudhaScheme, Aynamsa, DasaYearLength, KarakaScheme, NodeScheme } from '../../../helpers/horoscopeSettings';
import lodash from 'lodash';
import { updateMainSettings } from '../../../store/reducers/horoscopeSettings';
import { useLoadHoroscopes } from '../../../hooks/useLoadHororscope';
import {
  useGetDefaultLocation,
  useGetHoroscopeAddressInformation,
  useGetHoroscopeUserInfo
} from '../../../store/selectors';
import DarkThemeBackground from '../../../components/darkThemeBackground/DarkThemeBackground';
import { AddressLocation } from '../../../models/types/HoroscopeAddress';
import AddressInput from '../../../components/addressInput/AddressInput';
import { setDefaultLocation } from '../../../store/reducers/settingsReducer';
import { processorRoutes } from '../../astrlogicalProcessor/processorRoutes';
import { ProcessorContext } from '../../../models/interfaces/processorContext';

interface MainProps extends SettingsPageProps {
  isModal?: boolean
}

const Main = ({ closeSettings, isModal }: MainProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [settings, setSettings] = useState({
    aynamsa: Aynamsa.lahiri,
    yearLength: DasaYearLength.meanSideral,
    charaKarakCount: KarakaScheme.knrao,
    arudhasCount: ArudhaScheme.knrao,
    nodeScheme: NodeScheme.true,
    vargaHora: 'samasaptaka',
    vargaDrekkana: 'jagannatha'
  });
  const horoscopeSettings = useAppSelector((state) => state?.horoscopeSettings);
  const loadHoroscope = useLoadHoroscopes();
  const userInfo = useGetHoroscopeUserInfo();
  const address = useGetHoroscopeAddressInformation();
  const isFirstLoad = useRef(true);
  const defaultLocation = useGetDefaultLocation();
  const [location, setLocation] = useState<AddressLocation>();

  useEffect(() => {
    setLocation(defaultLocation);
  }, [defaultLocation]);
  
  useEffect(() => {
    if (!isModal) {
      return;
    }

    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    
    loadHoroscope({ address, userInfo, settings: horoscopeSettings });
  }, [horoscopeSettings]);

  useEffect(() => {
    setSettings(horoscopeSettings);
  }, []);

  useHideNavbar();

  const isSettingChanged = useMemo(() => {
    return !lodash.isEqual(horoscopeSettings, settings) || location?.key !== defaultLocation.key;
  }, [horoscopeSettings, settings, location, defaultLocation]);

  const updateSettings = useCallback(() => {
    if (!isSettingChanged) {
      return;
    }

    if (!lodash.isEqual(horoscopeSettings, settings)) {
      dispatch(updateMainSettings(settings));
    }

    if (location?.key !== defaultLocation.key && location) {
      dispatch(setDefaultLocation(location));
    }
  }, [isSettingChanged, dispatch, horoscopeSettings, settings, location, defaultLocation]);
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

  const onAynamsaChange = useCallback((event: any, value: string) => {
    setSettings({
      ...settings,
      aynamsa: value as Aynamsa
    });
  }, [settings]);

  const onYearLengthChange = useCallback((event: any, value: string) => {
    setSettings({
      ...settings,
      yearLength: value as DasaYearLength
    });
  }, [settings]);

  const onArudhasChange = useCallback((event: any, value: string) => {
    setSettings({
      ...settings,
      arudhasCount: value as ArudhaScheme
    });
  }, [settings]);

  const onKarakasChange = useCallback((event: any, value: string) => {
    setSettings({
      ...settings,
      charaKarakCount: value as KarakaScheme
    });
  }, [settings]);

  const onNodesChange = useCallback((event: any, value: string) => {
    setSettings({
      ...settings,
      nodeScheme: value as NodeScheme
    });
  }, [settings]);

  return (
    <Grid>
      <DarkThemeBackground fillBody={!isModal}>
        <ConfirmationModal
          onSaveClick={onSaveClick}
          onCancelClick={onCancelClick}
          isOpen={isConfirmationModalOpen}
          close={toggleConfirmationModal}
        />
        <Grid item container alignItems={'center'} justifyContent={'space-between'} pl={2} pr={2} pt={4}>
          <Grid item mt={2}>
            <ButtonBack label={'Настройки'} onClick={onButtonBackClick}/>
          </Grid>
          {isSettingChanged && <Grid item>
            <ButtonSave onClick={updateSettings}/>
          </Grid>}
        </Grid>
        <Grid item pt={2} p={2}>
          <Typography fontFamily={'Playfair Display'} fontWeight={'bold'} fontSize={24} color={'white'}
            textAlign={'left'}>
            Основные настройки
          </Typography>
        </Grid>
        <Grid item container direction={'column'} p={2}>
          <Grid item>
            <Typography fontFamily={'Gilroy'} fontWeight={600} fontSize={16} color={'white'} textAlign={'left'}>
              Город по умолчанию
            </Typography>
          </Grid>
          <Grid item pt={2}>
            <AddressInput
              setAddressLocation={setLocation}
              placeholder={'Город по умолчанию'}
              addressLocation={location}
            />
          </Grid>
          <Grid item pt={2}>
            <Divider color={'#37366B'}/>
          </Grid>
        </Grid>
        <Grid item container direction={'column'} p={2}>
          <Grid item>
            <Typography fontFamily={'Gilroy'} fontWeight={600} fontSize={16} color={'white'} textAlign={'left'}>
              Айнамса
            </Typography>
          </Grid>
          <Grid item>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={settings.aynamsa}
              onChange={onAynamsaChange}
            >
              <FormControlLabel value={Aynamsa.lahiri} control={<Radio/>} label={<FormLabel label={'Traditional Lahiri *'}/>}/>
              <FormControlLabel value={Aynamsa.trueLahiri} control={<Radio/>} label={<FormLabel label={'True Lahiri'}/>}/>
              <FormControlLabel value={Aynamsa.rohiniPaksha} control={<Radio/>} label={<FormLabel label={'Rohini-Paksha'}/>}/>
              <FormControlLabel value={Aynamsa.pushyaPaksha} control={<Radio/>} label={<FormLabel label={'Pushya-Paksha'}/>}/>
              <FormControlLabel value={Aynamsa.bhasin} control={<Radio/>} label={<FormLabel label={'J.N.Bhasin'}/>}/>
              <FormControlLabel value={Aynamsa.raman} control={<Radio/>} label={<FormLabel label={'Raman'}/>}/>
              <FormControlLabel value={Aynamsa.sayana} control={<Radio/>} label={<FormLabel label={'Tropical (Sayana)'}/>}/>
            </RadioGroup>
          </Grid>
          <Grid item pt={2}>
            <Divider color={'#37366B'}/>
          </Grid>
        </Grid>
        <Grid item container direction={'column'} p={2}>
          <Grid item>
            <Typography fontFamily={'Gilroy'} fontWeight={600} fontSize={16} color={'white'} textAlign={'left'}>
              Даши таблицы: Длина года
            </Typography>
          </Grid>
          <Grid item>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={settings.yearLength}
              onChange={onYearLengthChange}
            >
              <FormControlLabel value={DasaYearLength.meanSideral} control={<Radio/>} label={<FormLabel label={'Средний сидерический год *'}/>}/>
              <FormControlLabel value={DasaYearLength.meanTropical} control={<Radio/>} label={<FormLabel label={'Средний тропический год'}/>}/>
              <FormControlLabel value={DasaYearLength.savana} control={<Radio/>} label={<FormLabel label={'Савана (360 дней)'}/>}/>
              <FormControlLabel value={DasaYearLength.lunarDays} control={<Radio/>} label={<FormLabel label={'360 титхи'}/>}/>
            </RadioGroup>
          </Grid>
          <Grid item pt={2}>
            <Divider color={'#37366B'}/>
          </Grid>
        </Grid>
        <Grid item container direction={'column'} p={2}>
          <Grid item>
            <Typography fontFamily={'Gilroy'} fontWeight={600} fontSize={16} color={'white'} textAlign={'left'}>
              Количество ЧАРА-КАРАК
            </Typography>
          </Grid>
          <Grid item pt={1}>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={settings.charaKarakCount}
              onChange={onKarakasChange}
            >
              <FormControlLabel value={KarakaScheme.knrao} control={<Radio/>} label={<FormLabel label={'7 карак (АК, АмК, БК, МК, ПК, ГК, ДК) *'}/>}/>
              <FormControlLabel value={KarakaScheme.srath} control={<Radio/>} label={<FormLabel label={'8 карак (АК, АмК, БК, ПиК, ПК, ГК, ДК, МК)'}/>}/>
            </RadioGroup>
          </Grid>
          <Grid item pt={2}>
            <Divider color={'#37366B'}/>
          </Grid>
        </Grid>
        <Grid item container direction={'column'} p={2}>
          <Grid item>
            <Typography fontFamily={'Gilroy'} fontWeight={600} fontSize={16} color={'white'} textAlign={'left'}>
              Расчет АРУДХ
            </Typography>
          </Grid>
          <Grid item pt={1}>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={settings.arudhasCount}
              onChange={onArudhasChange}
            >
              <FormControlLabel value={ArudhaScheme.knrao} control={<Radio/>} label={<FormLabel label={'Согласно К.Н. Рао *'} subLabel={'(Без исключений)'}/>}/>
              <FormControlLabel value={ArudhaScheme.srath} control={<Radio/>} label={<FormLabel label={'Согласно С. Ратху'} subLabel={'(С исключениями)'}/>}/>
            </RadioGroup>
          </Grid>
          <Grid item pt={2}>
            <Divider color={'#37366B'}/>
          </Grid>
        </Grid>
        <Grid item container direction={'column'} p={2}>
          <Grid item>
            <Typography fontFamily={'Gilroy'} fontWeight={600} fontSize={16} color={'white'} textAlign={'left'}>
              Значение узлов
            </Typography>
          </Grid>
          <Grid item container direction={'row'}>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="1"
              name="radio-buttons-group"
              row
              sx={{ display: 'flex', width: '100%' }}
              value={settings.nodeScheme}
              onChange={onNodesChange}
            >
              <FormControlLabel sx={{ flex: 1 }} value={NodeScheme.true} control={<Radio/>} label={<FormLabel label={'Истинные *'}/>}/>
              <FormControlLabel sx={{ flex: 1 }} value={NodeScheme.mean} control={<Radio/>} label={<FormLabel label={'Средние'}/>}/>
            </RadioGroup>
          </Grid>
        </Grid>
        <Typography mt={2} ml={2} mr={2} color={'#99daea'} fontSize={'15px'} fontFamily={'Gilroy'}>
          *Астропроцессор по умолчанию имеет настройки, утверждённые школой прогнозов Альфа.<br/> <br/>

          Некоторые часто используемые настройки вы можете изменять. Остальные настройки приняты астропроцессором по умолчанию и не могут быть изменены:<br/>
          - Ретроградность планеты обозначается так (Pl)<br/>
          - Настройка Аштакаварги - Согласно Парашаре<br/>
          - Настройка Варшапхала - расчёт Бала согласно Чараку<br/>
          - Определение Манди и Гулика - Манди восходит в середине части Сатурна; Гулика восходит в начале части Сатурна<br/>
          - Восход (положение диска Солнца на восточном горизонте) - Центр Диска<br/><br/>

          Дробные карты, настройки по умолчанию:<br/>
          - Хора (Д2) - Самасаптака (на основе 1 и 7)<br/>
          - Дреккана (Д3) - Джаганнатха (трины от подвижных знаков)<br/>
          - Чатурамша (Д4) - Парашара<br/>
          - Панчамша (Д5)  - Парашара<br/>
          - Шаштамша (Д6) - Непрерывная и стандартная<br/>
          - Аштамша (Д8) - Непрерывная и стандартная<br/>
          - Навамша (Д9) -  Парашара<br/>
          - Рудрамша (Д11) - Зодиакальная<br/>
          - Двадашамша (Д12) - Парашара<br/>
          - Тримшамша (Д30) - Парашара<br/>
        </Typography>
        <Grid item width={'100%'} height={'80px'} pl={2} pr={2} pb={3}>
          {isSettingChanged && <Button type={ButtonType.gradient} onClick={updateSettings} text={'Сохранить изменения'}/> }
        </Grid>
      </DarkThemeBackground>
    </Grid>
  );
};

export default Main;
