import React, { useCallback, useEffect, useId } from 'react';
import { OptionsProps } from './OptionsProps';
import { Grid, GridWrap, Typography } from '@mui/material';
import { Option } from '../../models/types/Option';
import styles from './Options.module.scss';
import classNames from 'classnames';

const Options = ({ options, value, setValue, isScrollable, isOutlined, limit }: OptionsProps) => {
  const id = useId();
  const onSetValueClick = useCallback((option: Option) => {
    if (!setValue) {
      return;
    }

    if (!Array.isArray(value)) {
      setValue(option);
      return;
    }

    if (value.find((_option) => _option.value === option.value)) {
      setValue(value.filter((value) => value.value !== option.value));
      return;
    }

    if (limit && limit <= value.length) {
      return;
    }

    setValue([
      ...value,
      option
    ]);
  }, [limit, setValue, value]);

  const isTargetValue = useCallback((targetValue: any) => {
    if (!Array.isArray(value)) {
      return String(value) === String(targetValue);
    }

    return value.find((option) => option.value === targetValue);
  }, [value]);

  useEffect(() => {
    const target = document.getElementById(`${id}-${value}`);

    if (target?.scrollIntoView && isScrollable) {
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [value, isScrollable]);

  return (
    <div className={classNames({ [styles.scrollable]: isScrollable })}>
      <Grid container wrap={classNames({ nowrap: isScrollable, wrap: !isScrollable }) as GridWrap}>
        {options?.map((item: Option) => (
          <Grid
            key={item.value}
            className={classNames(
              styles.option,
              {
                [styles.target]: isTargetValue(item.value) && !isOutlined,
                [styles.outlined]: isOutlined,
                [styles.targetOutlined]: isTargetValue(item.value) && isOutlined,
                [styles.filled]: !isOutlined
              })
            }
            mr={1}
            mt={1}
            id={`${id}-${item.value}`}
            onClick={() => {
              onSetValueClick(item);
            }}
          >
            <Typography whiteSpace={'nowrap'} lineHeight={'16px'} fontWeight={300} fontFamily={'Gilroy'} fontStyle={'normal'} fontSize={'16px'}>
              {item.label}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Options;
