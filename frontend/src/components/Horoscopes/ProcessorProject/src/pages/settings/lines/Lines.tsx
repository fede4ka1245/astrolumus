import React, { useState } from 'react';
import PlanetBackground from '../../../components/planetBackground/PlanetBackground';
import { Grid, Typography } from '@mui/material';
import ButtonBack from '../../../components/buttonBack/ButtonBack';
import ButtonSave from '../../../components/buttonSave/ButtonSave';
import { useNavigate } from '../../../contexts/NavigationContext';
import { Option } from '../../../models/types/Option';
import Options from '../../../components/options/Options';
import { useHideNavbar } from '../../../hooks/useHideNavbar';

const options = [
  {
    value: 1,
    label: '5 мин'
  },
  {
    value: 2,
    label: '10 мин'
  },
  {
    value: 3,
    label: '15 мин'
  },
  {
    value: 4,
    label: '20 мин'
  }
];

const Lines = () => {
  const navigate = useNavigate();
  const [targetOption, setTargetOption] = useState<Option>(options[0]);

  useHideNavbar();

  return (
    <>
      <PlanetBackground/>
      <Grid container pr={2} pl={2} pt={5} pb={5} rowSpacing={2}>
        <Grid item container alignItems={'center'} justifyContent={'space-between'}>
          <Grid item>
            <ButtonBack label={'Настройки'} onClick={() => navigate(-1)}/>
          </Grid>
          <Grid item>
            <ButtonSave onClick={() => console.log(123)}/>
          </Grid>
        </Grid>
        <Grid item pt={2}>
          <Typography fontFamily={'Playfair Display'} fontWeight={'bold'} fontSize={24} color={'white'}
            textAlign={'left'}>
            Айнамаша
          </Typography>
        </Grid>
        <Grid item pt={2}>
          <Options options={options} value={targetOption.value} setValue={(value) => setTargetOption(value)} />
        </Grid>
      </Grid>
    </>
  );
};

export default Lines;
