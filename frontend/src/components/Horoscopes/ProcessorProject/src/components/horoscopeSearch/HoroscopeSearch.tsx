import React, { useCallback, useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { SavedHoroscope } from '../../models/types/SavedHoroscopes';
import styles from './HoroscopeSearch.module.scss';
import MyHoroscope from '../../components/myHororscope/MyHoroscope';
import { searchMyHoroscopes } from '../../api/savedHorsocopes';
import { Mutex } from 'async-mutex';
import { debounce } from 'lodash';
import MyHoroscopeLoader from '../../components/myHoroscopeLoader/MyHoroscopeLoader';
import IconButton from '../iconButton/IconButton';

interface HoroscopeSearchProps {
  close: (props?: any) => any,
  onHoroscopeSet?: (horoscope: SavedHoroscope) => any
}

const searchHoroscopes = (() => {
  const mutex = new Mutex();

  return (query: string) => mutex.runExclusive(() => searchMyHoroscopes(query));
})();

const HoroscopeSearch = ({ close, onHoroscopeSet }: HoroscopeSearchProps) => {
  const [horoscopes, setHoroscopes] = useState<SavedHoroscope []>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const searchHoroscopesDebounced = useCallback(debounce((search: string) => {
    setIsLoading(true);
    searchHoroscopes(search)
      ?.then((horoscopes) => {
        setHoroscopes(horoscopes);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, 250), []);

  useEffect(() => {
    setIsLoading(true);
    searchHoroscopesDebounced(search);
  }, [search]);
  
  return (
    <Grid display={'flex'} flexDirection={'column'} ml={2} mr={2} mt={1} width={'100%'}>
      <Grid mb={4} display={'flex'} width={'100%'} alignItems={'center'} height={'50px'} borderBottom={'rgba(255, 255, 255, 0.5) solid 1px'} position={'relative'}>
        <IconButton>
          <svg width="23" height="23" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8.63636" cy="8.63636" r="7.63636" stroke="#C3C9CD" strokeWidth="2"/>
            <path d="M14.0908 14.0909L19.0908 19.0909" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </IconButton>
        <input
          className={styles.search}
          value={search}
          autoFocus
          placeholder="Введите фразу для поиска"
          onChange={(event) => setSearch(event.target.value)}
        />
        <IconButton onClick={close}>
          <svg width="20" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 1.5L12.5 12.5" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12.5 1.5L1.5 12.5" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </IconButton>
      </Grid>
      {!isLoading && horoscopes.map((horoscope) => (
        <Grid mb={1} key={horoscope.id}>
          <MyHoroscope horoscope={horoscope} onHoroscopeSet={onHoroscopeSet} />
        </Grid>
      ))}
      {isLoading && Array.from({ length: 5 }).map((_, index) => (
        <Grid mb={1} key={index}>
          <MyHoroscopeLoader />
        </Grid>
      ))}

      {!isLoading && !horoscopes.length && <Grid item container py={5} mb={'15px'} justifyItems={'center'} flexDirection={'column'} alignItems={'center'} border={'1px solid rgba(255,255,255,0.7)'} borderRadius={'20px'}>
        <Grid item>
          <Typography fontFamily={'Gilroy'} textAlign={'center'} lineHeight={'15px'} color={'rgba(255,255,255,0.7)'} fontSize={'15px'}>
            Не найдено сохраненных гороскопов!
          </Typography>
        </Grid>
      </Grid>}
    </Grid>
  );
};

export default HoroscopeSearch;
