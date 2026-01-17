import React, { useCallback, useMemo } from 'react';
import styles from './RateCard.module.scss';
import { Grid, Typography } from '@mui/material';
import { replaceDomainsInHtml } from '../../../helpers/replaceDomainsInContent';

export interface RateCardProps {
  price?: number,
  header?: number | string,
  timeUnit?: string,
  lineWidth?: string,
  background?: string,
  description?: any,
  link: string
}

const RateCard = ({ price, header, lineWidth, background, description, link }: RateCardProps) => {
  // const { float, total } = useMemo(() => {
  //   const [total, float] = String(price?.toFixed(2)).split('.');
  //
  //   return { total, float };
  // }, [price]);

  const getText = useCallback((text: any): string => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    if (typeof text === 'object') {
      // Если это объект с переводами, всегда берем 'ru' по умолчанию
      return text.ru || text.en || Object.values(text)[0] || '';
    }
    return String(text);
  }, []);

  const navigateToPayment = useCallback(() => {
    window.open(link);
  }, [link]);
  
  const descriptionText = useMemo(() => {
    const text = getText(description);
    // Заменяем домены в HTML контенте
    return replaceDomainsInHtml(text);
  }, [description]);
  
  const headerText = getText(header);

  return (
    <section className={styles.main}>
      <Grid position={'relative'} width={'100%'} height={'100%'} container direction={'column'} p={2} justifyContent={'space-between'}>
        <div style={{ zIndex: -1, top: 0, left: 0, width: '100%', height: '100%', position: 'absolute', background }} />
        <Grid item container alignItems={'flex-start'} justifyContent={'space-between'} mb={1}>
          <Grid item display={'flex'} alignItems={'flex-end'} position={'relative'}>
            <Grid fontSize={'34px'} color={'#DBBF2E'} fontWeight={700} fontFamily={'Gilroy'} mr={1}>
              {headerText}
            </Grid>
          </Grid>
          <Grid item>
            <Typography component="div" fontSize={'14px'} color={'white'} fontWeight={400} fontFamily={'Gilroy'} textAlign={'start'}>
              {descriptionText && (
                <div dangerouslySetInnerHTML={{ __html: descriptionText }} />
              )}
            </Typography>
          </Grid>
        </Grid>
        <Grid item container justifyContent={'space-between'} alignItems={'center'}>
          <Grid item>
            {/* <Typography fontSize={'26px'} fontWeight={400} color={'white'} display={'flex'} justifyContent={'flex-start'}>
              ${total}.<Typography display={'inline'} mb={'auto'}>{float}</Typography>
            </Typography> */}
          </Grid>
          {/* <Grid item>
            <Typography sx={{ opacity: 0.7 }} color={'white'} fontWeight={400} fontSize={'16px'}>
              Подробнее
            </Typography>
          </Grid> */}
          <Grid item>
            <section className={styles.button} onClick={navigateToPayment}>
              Перейти
            </section>
          </Grid>
        </Grid>
      </Grid>
    </section>
  );
};

export default RateCard;
