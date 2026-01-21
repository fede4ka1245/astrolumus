import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { DegreeTableRow as IDegreeTableRow } from '../../../models/types/DegreeTableRow';
import { Grid } from '@mui/material';
import styles from '../DegreeTable.module.scss';
import arrowDown from '../assets/arrowDown.svg';
import arrowUp from '../assets/arrowUp.svg';
import ZodiacSign from '../../zodiacSign/ZodiacSign';
import DeepSkyInfo from '../deepSkyInfo/DeepSkyInfo';
import classNames from 'classnames';
import { translatePlanetName } from '../../../helpers/translatePlanetName';
import { translateZodiacSign } from '../../../helpers/translateZodiacSign';
import Collapse from '@mui/material/Collapse';
import { useGetLanguage } from '../../../store/selectors';
import Tappable from '../../tappable/Tappable';
import { useGetProcessorObject } from '../../../hooks/useGetProcessorObject';
import { ProcessorObjectType } from '../../../pages/horoscopes/types';
import { useAppDispatch } from '../../../store/store';
import { setTargetProcessorObject } from '../../../store/reducers/horoscopesReducer';
import { ZodiacSign as ZodiacSignEnum } from '../../../models/enums/ZodiacSign';

interface DegreeTableRowProps {
  degreeTableRow: IDegreeTableRow,
  isDeepSkyActive?: boolean
}

const DegreeTableRow = ({ degreeTableRow, isDeepSkyActive }: DegreeTableRowProps) => {
  const [isDeepSkyInfoOpen, setIsDeepSkyInfoOpen] = useState(false);

  const isDeepSky = useMemo(() => {
    return !!degreeTableRow.deepSkyObjects?.length && isDeepSkyActive;
  }, [degreeTableRow, isDeepSkyActive]);

  useLayoutEffect(() => {
    if (isDeepSky) {
      setIsDeepSkyInfoOpen(true);
    }
  }, [isDeepSky]);

  const toggleIsDeepSkyInfoOpen = useCallback(() => {
    setIsDeepSkyInfoOpen(!isDeepSkyInfoOpen);
  }, [isDeepSkyInfoOpen]);

  useEffect(() => {
    if (!isDeepSkyActive) {
      setIsDeepSkyInfoOpen(false);
    }
  }, [isDeepSkyActive]);

  const language = useGetLanguage();
  const dispatch = useAppDispatch();

  const processorPlanetObject = useGetProcessorObject(ProcessorObjectType.Planet, degreeTableRow.planet.id);
  const processorSignObject = useGetProcessorObject(ProcessorObjectType.Sign, degreeTableRow.sign);

  const onPlanetClick = useCallback(() => {
    dispatch(setTargetProcessorObject(processorPlanetObject));
  }, [processorPlanetObject]);

  const onSignClick = useCallback(() => {
    dispatch(setTargetProcessorObject(processorSignObject));
  }, [processorSignObject]);

  const signLabel = typeof degreeTableRow.sign === 'number'
    ? ZodiacSignEnum[degreeTableRow.sign]
    : degreeTableRow.sign;

  return (
    <>
      <section className={classNames(styles.row, { [styles.isDeepSky]: isDeepSkyInfoOpen && !!degreeTableRow.deepSkyObjects?.length })}>
        <Grid display={'flex'} alignItems={'center'} overflow={'hidden'}>
          {/* {degreeTableRow.planet.additionalInfo && <div className={styles.planetAdditionalInfo}>
            <Tappable disabled={!processorKarakaObject} onClick={onKarakaClick}>
              {translateKaraka(degreeTableRow.karaka?.name, language)}
            </Tappable>
          </div>} */}
          <div className={styles.planet}>
            <Tappable disabled={!processorPlanetObject} onClick={onPlanetClick}>
              {translatePlanetName(degreeTableRow.planet.name, language)}
            </Tappable>
          </div>
          {degreeTableRow.planet.isRetragraded && <div className={styles.planetSign}>
            (R)
          </div>}
          {isDeepSky && isDeepSkyActive && <div className={styles.deepSkyToggle} onClick={toggleIsDeepSkyInfoOpen}>
            {!isDeepSkyInfoOpen && <img src={arrowDown} width={28} height={28}/>}
            {isDeepSkyInfoOpen && <img src={arrowUp} width={28} height={28}/>}
          </div>}
        </Grid>
        <Grid display={'flex'} alignItems={'center'} className={styles.signIcon}>
          <Tappable disabled={!processorSignObject} onClick={onSignClick}>
            <ZodiacSign zodiacSign={degreeTableRow.sign} />
          </Tappable>
          <div className={styles.signName}>
            {translateZodiacSign(signLabel, language)}
          </div>
        </Grid>
        <Grid display={'flex'} alignItems={'center'}>
          <div className={styles.degrees}>
            {String(degreeTableRow.degrees).padStart(2, '0')}° {String(degreeTableRow.minutes).padStart(2, '0')}&apos;
          </div>
        </Grid>
        {/* <Grid display={'flex'} alignItems={'center'}>
          {degreeTableRow.naksantra.mainInfo ? (
            <div className={styles.naksatra}>
              <Tappable disabled={!processorNaksatraObject} onClick={onNaksatraClick}>
                {getNaksatraName(degreeTableRow.naksantra.mainInfo, language) || '-'} ({degreeTableRow.naksantra.pada} / {translatePlanetName(degreeTableRow.naksantra.additionalInfo, language, true) || '-'})
              </Tappable>
            </div>
          ) : (
            <div className={styles.naksatra}>
              -
            </div>
          )}
        </Grid> */}
      </section>
      <Collapse in={Boolean(isDeepSky && isDeepSkyInfoOpen && degreeTableRow.deepSkyObjects?.length)} timeout={'auto'} unmountOnExit>
        {degreeTableRow.deepSkyObjects && degreeTableRow.deepSkyObjects.map((deepSkyObject, index) => (
          <DeepSkyInfo key={index} planet={degreeTableRow.planet.name} deepSkyObject={deepSkyObject}/>
        ))}
      </Collapse>
    </>
  );
};

export default DegreeTableRow;
