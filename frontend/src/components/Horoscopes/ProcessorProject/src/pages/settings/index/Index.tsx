import { Grid, Typography } from '@mui/material';
import TransparentButton from '../../../components/transparentButton/TransparentButton';
import ButtonBack from '../../../components/buttonBack/ButtonBack';
import Moon from '../../../components/moon/Moon';
import { useNavigate, useOutletContext } from '../../../contexts/NavigationContext';
import { transparentButtons } from './transparentButtons';
import { useHideNavbar } from '../../../hooks/useHideNavbar';
import DarkThemeBackground from '../../../components/darkThemeBackground/DarkThemeBackground';
import { routes } from '../../../models/enums/routes';
import { ProcessorContext } from '../../../models/interfaces/processorContext';
import Buttons from '../../horoscopes/components/buttons/Buttons';

const Index = () => {
  const navigate = useNavigate();
  const { route } = useOutletContext<ProcessorContext>();

  useHideNavbar();

  return (
    <DarkThemeBackground fillBody>
      <Grid height={'100%'}>
        <Moon />
        <Grid container>
          <Grid item pr={2} pl={2}>
            <ButtonBack onClick={() => navigate(route + routes.astrologicalProcessor)} label={'Назад'}/>
          </Grid>
          <Grid item container direction={'column'} pr={2} pl={2} pb={4}>
            <Grid item pb={3}>
              <Typography fontFamily={'Playfair Display'} fontWeight={'bold'} fontSize={24} color={'white'} textAlign={'center'}>
                Настройки
              </Typography>
            </Grid>
            {/* <Grid item pb={4}> */}
            {/*  <Video /> */}
            {/* </Grid> */}
            <Grid item container rowSpacing={2} columnSpacing={2} gridTemplateColumns={'repeat(1, 100%)'} display={'grid'}>
              {transparentButtons.map((button) => (
                <Grid item key={button.label}>
                  <TransparentButton
                    onClick={() => navigate(route + button.route)}
                    image={<img alt='image' src={button.imageSource} width={60} height={60}/>}
                    label={button.label}
                    isSquare={false}
                  />
                </Grid>
              ))}
            </Grid>
            <Grid item pt={4}>
              <Typography fontFamily={'Playfair Display'} fontWeight={'bold'} fontSize={20} color={'white'} textAlign={'center'} pb={2}>
                Действия
              </Typography>
              <Buttons />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </DarkThemeBackground>
  );
};

export default Index;
