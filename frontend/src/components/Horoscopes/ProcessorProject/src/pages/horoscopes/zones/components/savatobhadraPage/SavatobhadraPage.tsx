import React, { useCallback } from 'react';
import { Grid } from '@mui/material';
import { useGetSavatobhadra } from '../../../../../store/selectors';
import Savatobhadra from '../../chakras/savatobhadra/Savatobhadra';
import ChakraForm from '../chakraForm/ChakraForm';
import { useAppDispatch } from '../../../../../store/store';
import { useOnLoadChakra } from '../../../../../hooks/useLoadChakra';
import { ChakraType } from '../../../../../models/enums/ChakraType';
import { setSavatobhadra } from '../../../../../store/reducers/zonesReducer';
import { SavatobhadraTableRow } from '../../../../../models/types/SavatobhadraTableRow';
import { Zone } from '../../../../../models/types/Zone';

const SavatobhadraPage = () => {
  const savatobhadra = useGetSavatobhadra();
  const dispatch = useAppDispatch();

  const onChakraLoaded = useCallback((chakra: SavatobhadraTableRow [] | Zone []) => {
    dispatch(setSavatobhadra(chakra as SavatobhadraTableRow []));
  }, []);

  const onCountClick = useOnLoadChakra(ChakraType.sarvatobhadra, onChakraLoaded);

  return (
    <Grid pl={2} pr={2}>
      <Grid>
        <Savatobhadra savatobhadra={savatobhadra} />
      </Grid>
      <Grid pt={4}>
        <ChakraForm onCountClick={onCountClick} />
      </Grid>
    </Grid>
  );
};

export default SavatobhadraPage;
