import React from 'react';
import { Box, Button, Grid, Skeleton, Typography } from '@mui/material';
import astroProcessor from './assets/astroproccesor.png';
import forum from './assets/forum.png';
import telescope from './assets/telescope.png';
import heart from './assets/heart.png';

const Levels = () => {
  return (
    <>
      <Box pl={1} pr={1}>
        <Grid container borderRadius={'8px'} p={2} direction={'column'} sx={{ background: 'white' }}>
          <Typography fontFamily={'Playfair Display'} color={'#292E30'} fontWeight={700} fontSize={'24px'} pt={2}>
            Вы гость
          </Typography>
          <Typography fontFamily={'Gilroy'} color={'#292E30'} fontWeight={400} fontSize={'14px'} pt={2}>
            В ваши возможности гостя входят следующие параметры:
          </Typography>
          <Grid display={'flex'} alignItems={'center'} pt={2}>
            <img src={astroProcessor} width={30} height={30} />
            <Typography pl={2} textTransform={'uppercase'} letterSpacing={'0.1em'} color={'#37366B'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Астропроцессор
            </Typography>
          </Grid>
          <Grid mt={3} p={2} container borderRadius={'10px'} direction={'column'} sx={{ background: 'linear-gradient(180deg, #261C5C 55.73%, #365191 100%)' }}>
            <Typography fontFamily={'Gilroy'} color={'white'} fontWeight={500} fontSize={'16px'}>
              Осталось 10 дней
            </Typography>
            <Typography fontFamily={'Gilroy'} color={'white'} fontWeight={500} fontSize={'14px'} pt={1}>
              до 5 гороскопов  без сохранений
            </Typography>
            <Grid container pt={2}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Grid key={index} sx={{ background: '#49BC5B' }} width={'20px'} borderRadius={'1px'} mr={'2px'} height={'10px'}/>
              ))}
            </Grid>
          </Grid>
          <Grid mt={2} display={'flex'} alignItems={'center'}>
            <img src={forum} width={30} height={30} />
            <Typography pl={2} textTransform={'uppercase'} letterSpacing={'0.1em'} color={'#37366B'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Форум
            </Typography>
          </Grid>
          <Grid mt={3} p={2} container borderRadius={'10px'} direction={'column'} sx={{ background: '#f1f1f1' }}>
            <Typography fontFamily={'Gilroy'} color={'black'} fontWeight={500} fontSize={'16px'}>
              Создание 1 темы
            </Typography>
            <Typography fontFamily={'Gilroy'} color={'black'} fontWeight={500} fontSize={'16px'} pt={1}>
              Сообщений в своей теме 30
            </Typography>
            <Typography fontFamily={'Gilroy'} color={'black'} fontWeight={500} fontSize={'16px'} pt={1}>
              Сообщений не своей теме 10
            </Typography>
            <Typography fontFamily={'Gilroy'} color={'black'} fontWeight={500} fontSize={'16px'} pt={1}>
              Личных сообщений 2
            </Typography>
          </Grid>
          <Grid pt={2} pb={1}>
            <Button>
              <Typography color={'#261C5C'} fontFamily={'Gilroy'} fontWeight={500} fontSize={'16px'} textTransform={'none'}>
                Расширить доступ
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box pl={1} pr={1} mt={2}>
        <Grid container borderRadius={'8px'} p={2} direction={'column'} sx={{ background: 'white' }}>
          <Grid item p={2}>
            <img alt={'telescope'} src={telescope} width={64} height={64}/>
          </Grid>
          <Grid fontFamily={'Playfair Display'} color={'#292E30'} fontWeight={700} fontSize={'28px'} pt={2}>
            I урвень - недоступен
          </Grid>
          <Grid fontFamily={'Gilroy'} color={'#292E30'} fontWeight={400} fontSize={'14px'} pt={2}>
            Для достижения первого уровня необходимо...
          </Grid>
          <Grid display={'flex'} alignItems={'center'} pt={3}>
            <Skeleton sx={{ width: '34px', height: '34px', borderRadius: '50%', color: 'gray' }} variant={'rectangular'}/>
            <Typography pl={2} textTransform={'uppercase'} letterSpacing={'0.1em'} color={'#37366B'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Профиль
            </Typography>
          </Grid>
          <Grid display={'flex'} alignItems={'center'} pt={3} pl={1}>
            <Grid sx={{ background: 'gray' }} width={'20px'} height={'20px'} borderRadius={'50%'} />
            <Typography pl={2} color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Заполненый профиль
            </Typography>
          </Grid>
          <Grid display={'flex'} flexDirection={'column'} pt={3} pl={1}>
            <Typography color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Лайки твоего профиля (благодарность)
            </Typography>
            <Grid display={'flex'} alignItems={'center'} pt={1}>
              <img src={heart} width={24} height={24}/>
              <Typography pl={2} color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
                1/5
              </Typography>
            </Grid>
          </Grid>
          <Grid display={'flex'} flexDirection={'column'} pt={3} pl={1}>
            <Typography color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Кол-во подписчиков
            </Typography>
            <Grid display={'flex'} alignItems={'center'} pt={1}>
              <img src={heart} width={24} height={24}/>
              <Typography pl={2} color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
                1/5
              </Typography>
            </Grid>
          </Grid>
          <Grid mt={2} display={'flex'} alignItems={'center'}>
            <img src={forum} width={30} height={30} />
            <Typography pl={2} textTransform={'uppercase'} letterSpacing={'0.1em'} color={'#37366B'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Форум
            </Typography>
          </Grid>
          <Grid display={'flex'} flexDirection={'column'} pt={3} pl={1}>
            <Typography color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Кол-во созданных тем
            </Typography>
            <Grid display={'flex'} alignItems={'center'} pt={1}>
              <img src={heart} width={24} height={24}/>
              <Typography pl={2} color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
                1/5
              </Typography>
            </Grid>
          </Grid>
          <Grid display={'flex'} flexDirection={'column'} pt={3} pl={1}>
            <Typography color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Кол-во созданных тем
            </Typography>
            <Grid display={'flex'} alignItems={'center'} pt={1}>
              <img src={heart} width={24} height={24}/>
              <Typography pl={2} color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
                1/5
              </Typography>
            </Grid>
          </Grid>
          <Grid display={'flex'} flexDirection={'column'} pt={3} pl={1}>
            <Typography color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Кол-во созданных тем
            </Typography>
            <Grid display={'flex'} alignItems={'center'} pt={1}>
              <img src={heart} width={24} height={24}/>
              <Typography pl={2} color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
                1/5
              </Typography>
            </Grid>
          </Grid>
          <Grid display={'flex'} flexDirection={'column'} pt={3} pl={1}>
            <Typography color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Кол-во созданных тем
            </Typography>
            <Grid display={'flex'} alignItems={'center'} pt={1}>
              <img src={heart} width={24} height={24}/>
              <Typography pl={2} color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
                1/5
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box pl={1} pr={1} mt={2}>
        <Grid container borderRadius={'8px'} p={2} direction={'column'} sx={{ background: 'white' }}>
          <Grid item p={2}>
            <img alt={'telescope'} src={telescope} width={64} height={64}/>
          </Grid>
          <Grid fontFamily={'Playfair Display'} color={'#292E30'} fontWeight={700} fontSize={'28px'} pt={2}>
            II урвень - недоступен
          </Grid>
          <Grid fontFamily={'Gilroy'} color={'#292E30'} fontWeight={400} fontSize={'14px'} pt={2}>
            Для достижения первого уровня необходимо...
          </Grid>
          <Grid display={'flex'} alignItems={'center'} pt={3}>
            <Skeleton sx={{ width: '34px', height: '34px', borderRadius: '50%', color: 'gray' }} variant={'rectangular'}/>
            <Typography pl={2} textTransform={'uppercase'} letterSpacing={'0.1em'} color={'#37366B'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Профиль
            </Typography>
          </Grid>
          <Grid display={'flex'} alignItems={'center'} pt={3} pl={1}>
            <Grid sx={{ background: 'gray' }} width={'20px'} height={'20px'} borderRadius={'50%'} />
            <Typography pl={2} color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Заполненый профиль
            </Typography>
          </Grid>
          <Grid display={'flex'} flexDirection={'column'} pt={3} pl={1}>
            <Typography color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Лайки твоего профиля (благодарность)
            </Typography>
            <Grid display={'flex'} alignItems={'center'} pt={1}>
              <img src={heart} width={24} height={24}/>
              <Typography pl={2} color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
                1/5
              </Typography>
            </Grid>
          </Grid>
          <Grid display={'flex'} flexDirection={'column'} pt={3} pl={1}>
            <Typography color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Кол-во подписчиков
            </Typography>
            <Grid display={'flex'} alignItems={'center'} pt={1}>
              <img src={heart} width={24} height={24}/>
              <Typography pl={2} color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
                1/5
              </Typography>
            </Grid>
          </Grid>
          <Grid mt={2} display={'flex'} alignItems={'center'}>
            <img src={forum} width={30} height={30} />
            <Typography pl={2} textTransform={'uppercase'} letterSpacing={'0.1em'} color={'#37366B'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Форум
            </Typography>
          </Grid>
          <Grid display={'flex'} flexDirection={'column'} pt={3} pl={1}>
            <Typography color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Кол-во созданных тем
            </Typography>
            <Grid display={'flex'} alignItems={'center'} pt={1}>
              <img src={heart} width={24} height={24}/>
              <Typography pl={2} color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
                1/5
              </Typography>
            </Grid>
          </Grid>
          <Grid display={'flex'} flexDirection={'column'} pt={3} pl={1}>
            <Typography color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Кол-во созданных тем
            </Typography>
            <Grid display={'flex'} alignItems={'center'} pt={1}>
              <img src={heart} width={24} height={24}/>
              <Typography pl={2} color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
                1/5
              </Typography>
            </Grid>
          </Grid>
          <Grid display={'flex'} flexDirection={'column'} pt={3} pl={1}>
            <Typography color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Кол-во созданных тем
            </Typography>
            <Grid display={'flex'} alignItems={'center'} pt={1}>
              <img src={heart} width={24} height={24}/>
              <Typography pl={2} color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
                1/5
              </Typography>
            </Grid>
          </Grid>
          <Grid display={'flex'} flexDirection={'column'} pt={3} pl={1}>
            <Typography color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Кол-во созданных тем
            </Typography>
            <Grid display={'flex'} alignItems={'center'} pt={1}>
              <img src={heart} width={24} height={24}/>
              <Typography pl={2} color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
                1/5
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box pl={1} pr={1} mt={2}>
        <Grid container borderRadius={'8px'} p={2} direction={'column'} sx={{ background: 'white' }}>
          <Grid item p={2}>
            <img alt={'telescope'} src={telescope} width={64} height={64}/>
          </Grid>
          <Grid fontFamily={'Playfair Display'} color={'#292E30'} fontWeight={700} fontSize={'28px'} pt={2}>
            III урвень - недоступен
          </Grid>
          <Grid fontFamily={'Gilroy'} color={'#292E30'} fontWeight={400} fontSize={'14px'} pt={2}>
            Для достижения первого уровня необходимо...
          </Grid>
          <Grid display={'flex'} alignItems={'center'} pt={3}>
            <Skeleton sx={{ width: '34px', height: '34px', borderRadius: '50%', color: 'gray' }} variant={'rectangular'}/>
            <Typography pl={2} textTransform={'uppercase'} letterSpacing={'0.1em'} color={'#37366B'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Профиль
            </Typography>
          </Grid>
          <Grid display={'flex'} alignItems={'center'} pt={3} pl={1}>
            <Grid sx={{ background: 'gray' }} width={'20px'} height={'20px'} borderRadius={'50%'} />
            <Typography pl={2} color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Заполненый профиль
            </Typography>
          </Grid>
          <Grid display={'flex'} flexDirection={'column'} pt={3} pl={1}>
            <Typography color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Лайки твоего профиля (благодарность)
            </Typography>
            <Grid display={'flex'} alignItems={'center'} pt={1}>
              <img src={heart} width={24} height={24}/>
              <Typography pl={2} color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
                1/5
              </Typography>
            </Grid>
          </Grid>
          <Grid display={'flex'} flexDirection={'column'} pt={3} pl={1}>
            <Typography color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Кол-во подписчиков
            </Typography>
            <Grid display={'flex'} alignItems={'center'} pt={1}>
              <img src={heart} width={24} height={24}/>
              <Typography pl={2} color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
                1/5
              </Typography>
            </Grid>
          </Grid>
          <Grid mt={2} display={'flex'} alignItems={'center'}>
            <img src={forum} width={30} height={30} />
            <Typography pl={2} textTransform={'uppercase'} letterSpacing={'0.1em'} color={'#37366B'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Форум
            </Typography>
          </Grid>
          <Grid display={'flex'} flexDirection={'column'} pt={3} pl={1}>
            <Typography color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Кол-во созданных тем
            </Typography>
            <Grid display={'flex'} alignItems={'center'} pt={1}>
              <img src={heart} width={24} height={24}/>
              <Typography pl={2} color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
                1/5
              </Typography>
            </Grid>
          </Grid>
          <Grid display={'flex'} flexDirection={'column'} pt={3} pl={1}>
            <Typography color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Кол-во созданных тем
            </Typography>
            <Grid display={'flex'} alignItems={'center'} pt={1}>
              <img src={heart} width={24} height={24}/>
              <Typography pl={2} color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
                1/5
              </Typography>
            </Grid>
          </Grid>
          <Grid display={'flex'} flexDirection={'column'} pt={3} pl={1}>
            <Typography color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Кол-во созданных тем
            </Typography>
            <Grid display={'flex'} alignItems={'center'} pt={1}>
              <img src={heart} width={24} height={24}/>
              <Typography pl={2} color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
                1/5
              </Typography>
            </Grid>
          </Grid>
          <Grid display={'flex'} flexDirection={'column'} pt={3} pl={1}>
            <Typography color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
              Кол-во созданных тем
            </Typography>
            <Grid display={'flex'} alignItems={'center'} pt={1}>
              <img src={heart} width={24} height={24}/>
              <Typography pl={2} color={'black'} fontFamily={'Gilroy'} fontWeight={700} fontSize={'16px'}>
                1/5
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Levels;
