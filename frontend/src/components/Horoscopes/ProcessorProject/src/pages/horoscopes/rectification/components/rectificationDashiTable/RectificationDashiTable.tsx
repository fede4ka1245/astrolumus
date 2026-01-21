import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Option } from '../../../../../models/types/Option';
import { useGetRectification } from '../../../../../store/selectors';
import { useAppDispatch } from '../../../../../store/store';
import { Grid } from '@mui/material';
import HoroscopesLoader from '../../../components/horoscopeLoader/HoroscopesLoader';
import Header from '../../../../../components/header/Header';
import Options from '../../../../../components/options/Options';
import DashiTable from '../../../../../components/dashiTable/DashiTable';
import Loader from '../../../../../components/loader/Loader';
import { getCharaDashi } from '../../../../../api/getCharaDashi';
import Button from '../../../../../components/button/Button';
import {
  setIsRectificationChrDashiLoading,
  setIsRectificationDashiChrPeriodLoading,
  setRectificationDashiChr
} from '../../../../../store/reducers/rectificationReducer';

const dashiOptions = [
  {
    label: 'Вимшоттари Даша',
    value: 'vim'
  },
  {
    label: 'Чара Даша',
    value: 'chr'
  }
];

const RectificationDashiTable = () => {
  const [dashi, setDashi] = useState<Option>(dashiOptions[0]);
  const rectification = useGetRectification();
  const dashiChr = useMemo(() => rectification.dashiChr, [rectification.dashiChr]);
  const dashiVim = useMemo(() => rectification.dashiVim, [rectification.dashiVim]);
  const isDashiChrPeriodLoading = useMemo(() => rectification.isDashiChrPeriodLoading, [rectification.isDashiChrPeriodLoading]);
  const horoscopeUserInfo = useMemo(() => rectification.horoscopeUserInfo, [rectification.horoscopeUserInfo]);
  const isDashiChrLoading = useMemo(() => rectification.isDashiChrLoading, [rectification.isDashiChrLoading]);
  const isDashiVimLoading = useMemo(() => rectification.isDashiVimLoading, [rectification.isDashiVimLoading]);
  const address = useMemo(() => rectification.addressInformation, [rectification.addressInformation]);
  const dispatch = useAppDispatch();

  const onLoadNextPeriod = useCallback(() => {
    if (!dashiChr) {
      return;
    }

    dispatch(setIsRectificationDashiChrPeriodLoading(true));

    getCharaDashi({
      address,
      userInfo: horoscopeUserInfo,
      dateStart: dashiChr?.dateEnd
    }).then((data) => {
      dispatch(setRectificationDashiChr({
        ...dashiChr,
        dateEnd: data.dateEnd,
        table: [...dashiChr.table, ...data.table]
      }));
    }).finally(() => {
      dispatch(setIsRectificationDashiChrPeriodLoading(false));
    });
  }, [dashiChr, dispatch, address, horoscopeUserInfo]);

  useEffect(() => {
    if (dashi.value !== 'chr' || dashiChr) {
      return;
    }

    dispatch(setIsRectificationChrDashiLoading(true));

    getCharaDashi({
      address,
      userInfo: horoscopeUserInfo
    }).then((data) => {
      dispatch(setRectificationDashiChr(data));
    }).finally(() => {
      dispatch(setIsRectificationChrDashiLoading(false));
    });
  }, [address, dashi, dashiChr, dispatch, horoscopeUserInfo]);

  return (
    <Grid container pt={2} direction={'column'} rowSpacing={2}>
      <Grid item pl={2}>
        <Header header={'Периоды Даши'} isIconActive={false} isPlain />
      </Grid>
      <Grid item pl={2} pt={2} sx={{ minWidth: 0, width: '100%' }}>
        <Options options={dashiOptions} setValue={setDashi} value={dashi.value} isScrollable />
      </Grid>
      {dashi.value === 'vim' && <Grid item pt={2}>
        {isDashiVimLoading && <HoroscopesLoader />}
        {!isDashiVimLoading && <DashiTable rows={dashiVim?.table} />}
      </Grid>}
      {dashi.value === 'chr' && <Grid item pt={2}>
        {isDashiChrLoading && <HoroscopesLoader />}
        {!isDashiChrLoading && <DashiTable rows={dashiChr?.table} type={'chara'} />}
        {!isDashiChrPeriodLoading && (
          <Grid item pt={2} px={2} pb={2}>
            <Button text="Рассчитать следующий цикл" onClick={onLoadNextPeriod} />
          </Grid>
        )}
        {isDashiChrPeriodLoading && <Grid width={'100%'} height={'160px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <Loader />
        </Grid>}
      </Grid>}
    </Grid>
  );
};

export default RectificationDashiTable;
