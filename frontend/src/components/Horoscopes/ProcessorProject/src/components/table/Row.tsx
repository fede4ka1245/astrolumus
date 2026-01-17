import React, { useMemo, useState } from 'react';
import { Typography } from '@mui/material';
import img from '../../pages/horoscopes/natMap/img.png';
import Info from './info/Info';
import arrowUp from './arrowUp.svg';
import arrowDown from './arrowDown.svg';
import classNames from 'classnames';
import styles from './Table.module.scss';
import ZodiacSign from '../zodiacSign/ZodiacSign';
import { ZodiacSign as Sign } from '../../models/enums/ZodiacSign';

const Row = ({ textColor }: any) => {
  const [isInfoOpen, setIsOpen] = useState(false);
  const fontColor = useMemo(() => {
    if (textColor) {
      return textColor;
    }

    return !isInfoOpen ? 'white' : '#261C5C';
  }, [textColor, isInfoOpen]);

  return (
    <>
      <td className={classNames({ [styles.isOpened]: isInfoOpen })}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography fontFamily={'Gilroy'} fontWeight={700} color={'#B4B3FF'} fontSize={'15px'} pr={1}>
            ДК
          </Typography>
          <Typography fontFamily={'Gilroy'} fontWeight={500} color={fontColor} fontSize={'15px'} pr={1}>
            Асцендент
          </Typography>
          <Typography fontFamily={'Gilroy'} fontWeight={400} color={fontColor} fontSize={'15px'} pr={1}>
            (R)
          </Typography>
        </div>
      </td>
      <td className={classNames({ [styles.isOpened]: isInfoOpen })} onClick={() => setIsOpen(!isInfoOpen)}>
        {!isInfoOpen && <img src={arrowDown} width={28} height={28}/>}
        {isInfoOpen && <img src={arrowUp} width={28} height={28}/>}
      </td>
      <td className={classNames({ [styles.isOpened]: isInfoOpen })}>
        <ZodiacSign zodiacSign={Sign.Scorpio} />
      </td>
      <td className={classNames({ [styles.isOpened]: isInfoOpen })}>
        <Typography fontFamily={'Gilroy'} fontWeight={700} color={fontColor} fontSize={'15px'}>
          23° 06’
        </Typography>
      </td>
      <td className={classNames({ [styles.isOpened]: isInfoOpen })}>
        <Typography fontFamily={'Gilroy'} fontWeight={500} color={fontColor} fontSize={'15px'}>
          ПШа (3/Be)
        </Typography>
      </td>
      {isInfoOpen && <Info />}
    </>
  );
};

export default Row;
