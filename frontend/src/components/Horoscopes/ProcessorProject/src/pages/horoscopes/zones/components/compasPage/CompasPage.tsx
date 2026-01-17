import React, { useCallback } from 'react';
import { useGetCompass } from '../../../../../store/selectors';
import { Grid } from '@mui/material';
import Compas from '../../chakras/compas/Compas';
import ChakraForm from '../chakraForm/ChakraForm';
import { SavatobhadraTableRow } from '../../../../../models/types/SavatobhadraTableRow';
import { Zone } from '../../../../../models/types/Zone';
import { setCompass } from '../../../../../store/reducers/zonesReducer';
import { useOnLoadChakra } from '../../../../../hooks/useLoadChakra';
import { ChakraType } from '../../../../../models/enums/ChakraType';
import { useAppDispatch } from '../../../../../store/store';

const CompasPage = () => {
  const compass = useGetCompass();
  const dispatch = useAppDispatch();

  const onChakraLoaded = useCallback((chakra: SavatobhadraTableRow [] | Zone []) => {
    dispatch(setCompass(chakra as Zone []));
  }, []);

  const onCountClick = useOnLoadChakra(ChakraType.chandraKalanala, onChakraLoaded);

  return (
    <Grid>
      <Grid>
        <Compas chakra={compass} />
      </Grid>
      <Grid pt={4}>
        <ChakraForm onCountClick={onCountClick} />
      </Grid>
    </Grid>
  );
};

export default CompasPage;
