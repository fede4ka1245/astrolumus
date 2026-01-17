import React, { useState } from 'react';
import Button from './components/button/Button';
import { Grid } from '@mui/material';
import classNames from 'classnames';
import styles from './Yogas.module.scss';

const Yogas = () => {
  const [page, setPage] = useState(1);

  return (
    <Grid container pl={2} pr={2} pt={2} pb={4} direction={'column'} rowSpacing={2}>
      <Grid item container>
        <Grid item pl={2} className={classNames(styles.text, { [styles.activeText]: page === 1 })} onClick={() => setPage(1)}>
            Бхава Йоги
        </Grid>
        <Grid item pl={5} className={classNames(styles.text, { [styles.activeText]: page === 2 })} onClick={() => setPage(2)}>
            Раси Йоги
        </Grid>
      </Grid>
      {page === 1 && (
        <>
          <Grid item>
            <Button text={'Паривартхана йога'} textColor={'#5C5B9F'} hint={'D1'} />
          </Grid>
          <Grid item>
            <Button text={'Раджа йога'} bgColor={'rgba(255, 255, 255, 0.1)'} textColor={'white'} hint={'D1'} />
          </Grid>
          <Grid item>
            <Button text={'Картари йога'} bgColor={'rgba(255, 255, 255, 0.1)'} textColor={'white'} hint={'D1'} />
          </Grid>
          <Grid item>
            <Button text={'Раджа йога'} bgColor={'rgba(255, 255, 255, 0.1)'} textColor={'white'} hint={'D1'} hintColor={'#49BC5B'} />
          </Grid>
          <Grid item>
            <Button text={'Випарита йога'} bgColor={'rgba(255, 255, 255, 0.1)'} textColor={'white'} hint={'D1'} hintColor={'#49BC5B'} />
          </Grid>
        </>
      )}
      {page === 2 && (
        <>
          <Grid item>
            <Button text={'Кемадрума йога'} bgColor={'#FF7474'} textColor={'white'} />
          </Grid>
          <Grid item>
            <Button text={'Чандра Мангала йога'} bgColor={'rgba(255, 116, 116, 0.3)'} textColor={'white'} />
          </Grid>
          <Grid item>
            <Button text={'Ванчана Чора Бхитхи йога'} bgColor={'rgba(255, 116, 116, 0.3)'} textColor={'white'} />
          </Grid>
          <Grid item>
            <Button text={'Веши йога'} bgColor={'rgba(73, 188, 91, 0.3)'} textColor={'white'} hintColor={'#49BC5B'} />
          </Grid>
          <Grid item>
            <Button text={'Убхайачари йога'} bgColor={'rgba(73, 188, 91, 0.3)'} textColor={'white'} hintColor={'#49BC5B'} />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default Yogas;
