import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Grid, Grow, Typography } from '@mui/material';
import { ITariff } from '../../models/interfaces/tariff';
import authRequest from '../../api/authRequest';
import { currentUserTariffsApi } from '../../api/tariff';
import { insertZero } from '../../helpers/insertZero';
import parse from 'html-react-parser';
import RateCard from '../../pages/rates/RateCard/RateCard';
import camelcaseKeys from 'camelcase-keys';
import ContentSkeleton from '../contentSkeleton/ContentSkeleton';
import { processTariffLink, replaceDomainsInHtml } from '../../helpers/replaceDomainsInContent';
import { useAppSelector } from '../../store/store';
import styles from '../../pages/rates/Rates.module.scss';
import logo from '../../pages/rates/assets/logo.svg';
import { getBackendUrl } from '../../helpers/getApiUrl';

interface PublicTariff {
  title: string | { [key: string]: string },
  publicDescription: string | { [key: string]: string }
  tariffLink: string
}

interface DisplayedTariff extends ITariff {
  activated: string
}

interface RatesContentProps {
  showHeader?: boolean;
  compact?: boolean;
}

const RatesContent = ({ showHeader = true, compact = false }: RatesContentProps) => {
  const [tariffs, setTariffs] = useState<ITariff[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [publicTariffs, setPublicTariffs] = useState<PublicTariff[]>([]);
  const userEmail = useAppSelector((state) => state?.user.userInfo.email);

  const getDescription = useCallback((description: any): string => {
    if (!description) return '';
    
    if (typeof description === 'object' && description !== null && !Array.isArray(description) && !(description instanceof Date)) {
      if (description.publicDescription) {
        const publicDesc = description.publicDescription;
        if (typeof publicDesc === 'object' && publicDesc !== null && !Array.isArray(publicDesc)) {
          return publicDesc.ru || '';
        }
        if (typeof publicDesc === 'string') {
          return publicDesc;
        }
      }
      if (description.description) {
        const desc = description.description;
        if (typeof desc === 'object' && desc !== null && !Array.isArray(desc)) {
          return desc.ru || '';
        }
        if (typeof desc === 'string') {
          return desc;
        }
      }
      if (description.ru !== undefined) {
        return description.ru || '';
      }
    }
    if (typeof description === 'string') {
      return description;
    }
    return '';
  }, []);
  
  const getTitle = useCallback((title: any): string => {
    if (!title) return '';
    if (typeof title === 'object' && title !== null && !Array.isArray(title) && !(title instanceof Date)) {
      return title.ru || '';
    }
    if (typeof title === 'string') {
      return title;
    }
    return '';
  }, []);

  const addDaysToStartDate = useCallback((tariff: string, days: number) => {
    if (tariff) {
      const startDate = new Date(tariff);
      const newDeadline = new Date(startDate.getTime() + (days * 24 * 60 * 60 * 1000));
      return newDeadline.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    return new Date();
  }, []);

  useEffect(() => {
    getTariff();
  }, []);

  const getTariff = useCallback(() => {
    setLoading(true);
    Promise.all([
      authRequest.get(currentUserTariffsApi())
        .then(res => {
          setTariffs(res.data);
        }),
      authRequest.get(`${getBackendUrl()}/tariffs/public/`)
        .then(({ data }) => {
          setPublicTariffs(camelcaseKeys(camelcaseKeys(data, { deep: true })));
        })
    ]).finally(() => {
      setLoading(false);
    });
  }, []);
  
  const { currentTariffs, futureTariffs } = useMemo(() => {
    const currentTariffsMap = new Map<number, DisplayedTariff>();
    const futureTariffsMap = new Map<number, DisplayedTariff>();
    
    for (const tariff of tariffs) {
      const validActivations = tariff.current_user_activates.filter(
        tariffActivated => new Date(tariffActivated).getTime() + tariff.validity_days * 24 * 60 * 60 * 1000 >= Date.now()
      );

      if (validActivations.length === 0) continue;

      const mostRecentActivation = validActivations.reduce((latest, current) => {
        return new Date(current).getTime() > new Date(latest).getTime() ? current : latest;
      });

      const displayedTariff: DisplayedTariff = {
        ...tariff,
        activated: mostRecentActivation
      };

      if (new Date(mostRecentActivation).getTime() <= Date.now()) {
        if (!currentTariffsMap.has(tariff.id)) {
          currentTariffsMap.set(tariff.id, displayedTariff);
        }
      } else {
        if (!futureTariffsMap.has(tariff.id)) {
          futureTariffsMap.set(tariff.id, displayedTariff);
        }
      }
    }

    return { 
      currentTariffs: Array.from(currentTariffsMap.values()),
      futureTariffs: Array.from(futureTariffsMap.values())
    };
  }, [tariffs]);

  return (
    <>
      {showHeader && (
        <Grid item display={'flex'} justifyContent={'space-between'} mb={2}>
          <Typography letterSpacing={'0.07em'} color={'#F0F0F3'} textTransform={'uppercase'} fontSize={'15px'} fontWeight={'bold'}>
            ВАШИ ТАРИФЫ
          </Typography>
        </Grid>
      )}
      
      {loading && <ContentSkeleton isDarkTheme={true} />}
      
      {!loading && currentTariffs.length === 0 && futureTariffs.length === 0 && (
        <Grow in={true} timeout={200}>
          <Grid item mb={3}>
            <Grid 
              container 
              p={2} 
              borderRadius={'10px'} 
              bgcolor={'rgba(240, 240, 243, 0.1)'} 
              border={'1px solid rgba(240, 240, 243, 0.2)'}
              justifyContent={'center'}
              alignItems={'center'}
              minHeight={'100px'}
            >
              <Typography color={'#F0F0F3'} fontFamily={'Gilroy'} fontWeight={400} fontSize={'16px'} textAlign={'center'}>
                Нет активных тарифов
              </Typography>
            </Grid>
          </Grid>
        </Grow>
      )}
      
      <Grow in={!loading} timeout={200}>
        <div>
          {currentTariffs.map((tariff, index) => (
            <React.Fragment key={`current-${tariff.id || index}`}>
              <Grid item justifyContent={'space-between'} mb={1}>
                <section className={styles.card}>
                  <img src={logo} className={styles.logo}/>
                  <Grid container direction={'column'} p={2} justifyContent={'space-between'} height={'100%'}>
                    <Grid item display={'flex'} flexDirection={'column'} alignItems={'flex-start'} mb={2}>
                      <Grid>
                        <Typography color={'white'} fontWeight={500} fontSize={'16px'}>
                          {getTitle(tariff.title)}
                        </Typography>
                        {tariff.code !== 'renew_wait' && (
                          <Typography color={'white'} fontWeight={500} fontSize={compact ? '12px' : '16px'}>
                            {insertZero(new Date(tariff.activated).getHours())}:
                            {insertZero(new Date(tariff.activated).getMinutes())} {insertZero(new Date(tariff.activated).getDate())}.
                            {insertZero(new Date(tariff.activated).getMonth() + 1)}.
                            {insertZero(new Date(tariff.activated).getFullYear())} - {insertZero(new Date(tariff.activated).getHours())}:
                            {insertZero(new Date(tariff.activated).getMinutes())} {insertZero(new Date(addDaysToStartDate(tariff.activated, tariff.validity_days)).getDate())}.
                            {insertZero(new Date(addDaysToStartDate(tariff.activated, tariff.validity_days)).getMonth() + 1)}.
                            {insertZero(new Date(addDaysToStartDate(tariff.activated, tariff.validity_days)).getFullYear())}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                    {!compact && (
                      <Grid item mb={2}>
                        <Typography component="div" color={'white'} fontFamily={'Gilroy'} fontWeight={500} fontSize={'14px'}>
                          {parse(replaceDomainsInHtml(getDescription(tariff.description)))}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </section>
              </Grid>
            </React.Fragment>
          ))}
        </div>
      </Grow>

      <Grow in={!loading} timeout={200}>
        <div>
          {futureTariffs.map((tariff, index) => (
            <React.Fragment key={`future-${tariff.id || index}`}>
              <Grid item justifyContent={'space-between'} mb={1}>
                <section className={styles.card}>
                  <img src={logo} className={styles.logo}/>
                  <Grid container direction={'column'} p={2} justifyContent={'space-between'} height={'100%'}>
                    <Grid item display={'flex'} flexDirection={'column'} alignItems={'flex-start'} mb={2}>
                      <Grid>
                        <Typography color={'white'} fontWeight={500} fontSize={'16px'}>
                          {getTitle(tariff.title)}, осталось {tariff.validity_days} д.
                        </Typography>
                        <Typography color={'white'} fontWeight={500} fontSize={compact ? '12px' : '16px'}>
                          {insertZero(new Date(tariff.activated).getHours())}:
                          {insertZero(new Date(tariff.activated).getMinutes())} {insertZero(new Date(tariff.activated).getDate())}.
                          {insertZero(new Date(tariff.activated).getMonth() + 1)}.
                          {insertZero(new Date(tariff.activated).getFullYear())} - {insertZero(new Date(tariff.activated).getHours())}:
                          {insertZero(new Date(tariff.activated).getMinutes())} {insertZero(new Date(addDaysToStartDate(tariff.activated, tariff.validity_days)).getDate())}.
                          {insertZero(new Date(addDaysToStartDate(tariff.activated, tariff.validity_days)).getMonth() + 1)}.
                          {insertZero(new Date(addDaysToStartDate(tariff.activated, tariff.validity_days)).getFullYear())}
                        </Typography>
                      </Grid>
                    </Grid>
                    {!compact && (
                      <Grid item mb={2}>
                        <Typography component="div" color={'white'} fontFamily={'Gilroy'} fontWeight={500} fontSize={'14px'}>
                          {parse(replaceDomainsInHtml(getDescription(tariff.description)))}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </section>
              </Grid>
            </React.Fragment>
          ))}
        </div>
      </Grow>
      
      <Grid item pt={2}>
        <Typography letterSpacing={'0.07em'} color={'#F0F0F3'} textTransform={'uppercase'} fontSize={'15px'} fontWeight={'bold'}>
          Выбрать тариф
        </Typography>
      </Grid>
      
      {loading && <ContentSkeleton isDarkTheme={true} />}
      
      <Grow in={!loading} timeout={200}>
        <div>
          {publicTariffs.map((tariff, index) => {
            const processedLink = processTariffLink(tariff.tariffLink, userEmail);
            
            return (
              <Grid key={`public-${tariff.tariffLink || index}`} item mt={2}>
                <RateCard
                  header={getTitle(tariff.title)}
                  description={getDescription(tariff)}
                  lineWidth={'20%'}
                  link={processedLink}
                  background={'linear-gradient(225deg, #9C9C9C 13.28%, rgba(112, 112, 112, 0) 81.25%)'}
                />
              </Grid>
            );
          })}
        </div>
      </Grow>
    </>
  );
};

export default RatesContent;
