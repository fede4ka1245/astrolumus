import React, { useCallback } from 'react';
import { Grid } from '@mui/material';
import ChakraForm from '../chakraForm/ChakraForm';
import { useGetCalanala } from '../../../../../store/selectors';
import Calanala from '../../chakras/calanala/Calanala';
import { useAppDispatch } from '../../../../../store/store';
import { SavatobhadraTableRow } from '../../../../../models/types/SavatobhadraTableRow';
import { Zone } from '../../../../../models/types/Zone';
import { setCalanala } from '../../../../../store/reducers/zonesReducer';
import { useOnLoadChakra } from '../../../../../hooks/useLoadChakra';
import { ChakraType } from '../../../../../models/enums/ChakraType';

const CalanalaPage = () => {
  const calanala = useGetCalanala();
  const dispatch = useAppDispatch();

  const onChakraLoaded = useCallback((chakra: SavatobhadraTableRow [] | Zone []) => {
    dispatch(setCalanala(chakra as Zone []));
  }, []);

  const onCountClick = useOnLoadChakra(ChakraType.suryaKalanala, onChakraLoaded);

  return (
    <Grid>
      <Grid>
        <Calanala chakra={calanala} />
      </Grid>
      <Grid pt={4}>
        <ChakraForm onCountClick={onCountClick} />
      </Grid>
    </Grid>
  );
};

export default CalanalaPage;
