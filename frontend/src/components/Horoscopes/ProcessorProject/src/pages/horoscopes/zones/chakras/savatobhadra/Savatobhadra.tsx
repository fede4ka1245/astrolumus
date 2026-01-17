import React, { useCallback, useState } from 'react';
import { SavatobhadraTableRow } from '../../../../../models/types/SavatobhadraTableRow';
import './Savatobhadra.scss';
import classNames from 'classnames';
import { Grid } from '@mui/material';

interface SavatobhadraProps {
  savatobhadra: SavatobhadraTableRow [],
}

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];

const getIsHeader = (sectionName: string) => {
  if (sectionName === 'a1' || sectionName === 'a9' || sectionName === 'i1' || sectionName === 'i9') {
    return false;
  }

  return sectionName.includes('a') || sectionName.includes('i') || sectionName.includes('9') || sectionName.includes('1');
};

const Savatobhadra = ({ savatobhadra }: SavatobhadraProps) => {
  const [activeHeader, setActiveHeader] = useState<string>('');

  const onSectionClick = useCallback((sectionName: string) => {
    if (!getIsHeader(sectionName)) {
      return;
    }

    if (activeHeader === sectionName) {
      setActiveHeader('');
      return;
    }

    setActiveHeader(sectionName);
  }, [activeHeader]);

  const isHighlighted = useCallback((sectionName: string) => {
    if (sectionName === 'a1' || sectionName === 'a9' || sectionName === 'i1' || sectionName === 'i9' || !activeHeader) {
      return false;
    }

    const [letter, number] = sectionName.split('');
    const [activeHeaderLetter, activeHeaderNumber] = activeHeader.split('');

    if ((activeHeaderLetter === 'a' && number === activeHeaderNumber) || (activeHeaderLetter === 'i' && number === activeHeaderNumber) || (activeHeaderLetter === letter && activeHeaderNumber === '1') || (activeHeaderLetter === letter && activeHeaderNumber === '9')) {
      return true;
    }

    return letters.findIndex((item) => letter === item) - Number(number) === letters.findIndex((item) => activeHeaderLetter === item) - Number(activeHeaderNumber) || letters.findIndex((item) => letter === item) + Number(number) === letters.findIndex((item) => activeHeaderLetter === item) + Number(activeHeaderNumber);
  }, [activeHeader]);

  return (
    <div className={'savatobhadra-table'}>
      {savatobhadra?.map((savatobhadraRow) => (
        <div
          key={savatobhadraRow.cellName}
          onClick={() => onSectionClick(savatobhadraRow.cellName)}
          className={classNames('section', savatobhadraRow.cellName, { highlighted: isHighlighted(savatobhadraRow.cellName), active: activeHeader === savatobhadraRow.cellName })}
        >
          {savatobhadraRow.elements.map((element) => (
            <Grid
              p={'0.5px'}
              key={element}
              className={classNames({ header: getIsHeader(savatobhadraRow.cellName) })}
            >
              {element}
            </Grid>
          ))}
          <Grid container justifyContent={'center'}>
            {savatobhadraRow.grahas.map((graha) => (
              <Grid p={'0.5px'} style={{ color: graha.color }} key={graha.name}>
                {graha.name}
              </Grid>
            ))}
          </Grid>
        </div>
      ))}
    </div>
  );
};

export default Savatobhadra;
