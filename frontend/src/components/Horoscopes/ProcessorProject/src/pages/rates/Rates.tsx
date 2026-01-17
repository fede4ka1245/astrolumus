import React from 'react';
import { Grid } from '@mui/material';
import ButtonBack from '../../components/buttonBack/ButtonBack';
import { useNavigate } from 'react-router-dom';
import { useHideNavbar } from '../../hooks/useHideNavbar';
import DarkThemeBackground from '../../components/darkThemeBackground/DarkThemeBackground';
import RatesContent from '../../components/ratesContent/RatesContent';

const Rates = () => {
  const navigate = useNavigate();

  useHideNavbar();

  return (
    <DarkThemeBackground fillBody>
      <Grid container pl={2} pr={2} pb={4} direction={'column'} minHeight={'80vh'}>
        <Grid item pt={7}>
          <ButtonBack label={'Назад'} onClick={() => navigate(-1)} />
        </Grid>
        <Grid item pt={2}>
          <RatesContent showHeader={true} />
        </Grid>
      </Grid>
    </DarkThemeBackground>
  );
};

export default Rates;
