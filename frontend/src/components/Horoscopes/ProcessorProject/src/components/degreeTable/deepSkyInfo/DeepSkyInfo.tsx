import React, { useEffect, useMemo, useState } from 'react';
import styles from './Info.module.scss';
import background from './assets/img.png';
import { Grid, Typography } from '@mui/material';
import { CurrentDeepSkyObject } from '../../../models/types/CurrentDeepSkyObject';
import ZodiacSign from '../../zodiacSign/ZodiacSign';
import axios from 'axios';
import DeepSkyInfoImage from './components/deepSkyInfoImage/DeepSkyInfoImage';

interface DeepSkyInfoProps {
  deepSkyObject: CurrentDeepSkyObject,
  planet: string
}

const DeepSkyInfo = ({ deepSkyObject, planet }: DeepSkyInfoProps) => {
  const [constellation, setConstellation] = useState<string>('');
  
  const isDescriptionActive = useMemo(() => {
    return deepSkyObject.comment !== '<p>0</p>';
  }, [deepSkyObject.comment]);

  useEffect(() => {
    axios.get(`https://backm.alpha-astro.ru/deep_sky/constellations/${deepSkyObject.constellation}`)
      .then(({ data }) => {
        setConstellation(data.title);
      });
  }, []);

  const isImageExist = useMemo(() => {
    return deepSkyObject.imageUrl && deepSkyObject.imageUrl.includes('/images/');
  }, [deepSkyObject.imageUrl]);
  
  const formattedArea = useMemo(() => {
    if (!deepSkyObject.area) {
      return;
    }

    const area = deepSkyObject.area.trim();
    
    const invalidPatterns = [
      'вернуть результат в формате JSON',
    ];
    
    const isInvalid = invalidPatterns.some(pattern => 
      area.toLowerCase().includes(pattern.toLowerCase())
    );
    
    if (isInvalid || area.length < 2 || area === '0') {
      return;
    }
    
    return area;
  }, [deepSkyObject.area]);

  return (
    <div className={styles.main}>
      <img alt='background' width={'100%'} height={'100%'} src={background} className={styles.image}/>
      <Grid container p={'12px'} direction={'column'} zIndex={2}>
        <Grid item mb={4}>
          <Typography fontFamily={'Gilroy'} fontWeight={700} color={'white'} lineHeight={'20px'} fontSize={'18px'}>
            {planet} соединяется с Deep Sky объектом
          </Typography>
        </Grid>
        <Grid item container direction={'row'} display={'flex'}>
          <Grid item position={'relative'} mr={3} width={'100px'}>
            {isImageExist && (<DeepSkyInfoImage url={deepSkyObject.imageUrl as string} />)}
          </Grid>
          <Grid container item direction={'column'} flex={1}>
            <Grid item mt={-1}>
              <Typography fontFamily={'Gilroy'} fontWeight={700} color={'white'} lineHeight={'16px'} fontSize={'16px'}>
                {deepSkyObject.title}
              </Typography>
            </Grid>
            <Grid item container mt={2}>
              <Grid container direction={'row'}>
                <Grid container item direction={'column'} width={'100px'}>
                  <Grid item>
                    <Typography fontFamily={'Gilroy'} fontWeight={700} color={'white'} fontSize={'12px'}>
                      Сидерический
                    </Typography>
                  </Grid>
                  <Grid item display={'flex'} pt={1} alignItems={'center'}>
                    {deepSkyObject?.year?.siderealSign && <ZodiacSign zodiacSign={deepSkyObject.year.siderealSign} />}
                    <Typography fontFamily={'Gilroy'} fontWeight={700} color={'white'} fontSize={'16px'} pl={1}>
                      {String(deepSkyObject?.year?.siderealSigndegree).padStart(2, '0')}° {String(deepSkyObject?.year?.siderealMinutes).padStart(2, '0')}’
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container item direction={'column'} width={'100px'}>
                  <Grid item>
                    <Typography fontFamily={'Gilroy'} fontWeight={700} color={'white'} fontSize={'12px'}>
                      Тропический
                    </Typography>
                  </Grid>
                  <Grid item display={'flex'} pt={1} alignItems={'center'}>
                    {deepSkyObject?.year?.tropicalSign && <ZodiacSign zodiacSign={deepSkyObject?.year?.tropicalSign} />}
                    <Typography fontFamily={'Gilroy'} fontWeight={700} color={'white'} fontSize={'16px'} pl={1}>
                      {String(deepSkyObject?.year?.tropicalSigndegree).padStart(2, '0')}° {String(deepSkyObject?.year?.tropicalMinutes).padStart(2, '0')}’
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid display={'flex'} flexDirection={'column'}>
                {constellation && <Typography fontFamily={'Gilroy'} fontWeight={700} color={'white'} fontSize={'12px'} mt={1}>
                  Созвездие: {constellation}
                </Typography>}
                {formattedArea && <Typography fontFamily={'Gilroy'} fontWeight={700} color={'white'} fontSize={'12px'} mt={1}>
                  Область: {formattedArea}
                </Typography>}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item mt={3}>
          {isDescriptionActive &&
            <Typography fontFamily={'Gilroy'} fontWeight={400} color={'white'} lineHeight={'14px'} fontSize={'13px'}>
              <div dangerouslySetInnerHTML={{ __html: deepSkyObject.comment || '' }}/>
            </Typography>
          }
        </Grid>
      </Grid>
    </div>
  );
};

export default DeepSkyInfo;
