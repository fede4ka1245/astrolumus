import React from 'react';
import PlanetBackground from '../../../components/planetBackground/PlanetBackground';
import { Grid, Typography } from '@mui/material';
import ButtonBack from '../../../components/buttonBack/ButtonBack';
import ButtonSave from '../../../components/buttonSave/ButtonSave';
import Input from '../../../components/input/Input';
import { useNavigate } from '../../../contexts/NavigationContext';
import { useHideNavbar } from '../../../hooks/useHideNavbar';

const Maps = () => {
  const navigate = useNavigate();

  useHideNavbar();

  return (
    <>
      <PlanetBackground />
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
          <Typography fontFamily={'Placeholder'} fontWeight={'bold'} fontSize={24} color={'white'}
            textAlign={'left'}>
            Расчет дробных карт
          </Typography>
        </Grid>
        <Grid item container direction={'column'}>
          <Grid item>
            <Typography fontFamily={'Gilroy'} fontWeight={600} fontSize={16} color={'white'} textAlign={'left'}>
              Хора
            </Typography>
          </Grid>
          <Grid item pt={1}>
            <Input placeholder={'Placeholder'}/>
          </Grid>
        </Grid>
        <Grid item container direction={'column'}>
          <Grid item>
            <Typography fontFamily={'Gilroy'} fontWeight={600} fontSize={16} color={'white'} textAlign={'left'}>
              Дреккана
            </Typography>
          </Grid>
          <Grid item pt={1}>
            <Input placeholder={'Placeholder'}/>
          </Grid>
        </Grid>
        <Grid item container direction={'column'}>
          <Grid item>
            <Typography fontFamily={'Gilroy'} fontWeight={600} fontSize={16} color={'white'} textAlign={'left'}>
              Чатуртхамша
            </Typography>
          </Grid>
          <Grid item pt={1}>
            <Input placeholder={'Placeholder'}/>
          </Grid>
        </Grid>
        <Grid item container direction={'column'}>
          <Grid item>
            <Typography fontFamily={'Gilroy'} fontWeight={600} fontSize={16} color={'white'} textAlign={'left'}>
              Панчамша
            </Typography>
          </Grid>
          <Grid item pt={1}>
            <Input placeholder={'Placeholder'}/>
          </Grid>
        </Grid>
        <Grid item container direction={'column'}>
          <Grid item>
            <Typography fontFamily={'Gilroy'} fontWeight={600} fontSize={16} color={'white'} textAlign={'left'}>
              Аштамша
            </Typography>
          </Grid>
          <Grid item pt={1}>
            <Input placeholder={'Placeholder'}/>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Maps;
