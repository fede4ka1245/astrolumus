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

    if (target && isScrollable) {
      const container = target.closest(`.${styles.scrollable}`) as HTMLElement | null;
      if (!container) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const currentScrollLeft = container.scrollLeft;
      const targetCenter = targetRect.left - containerRect.left + currentScrollLeft + targetRect.width / 2;
      const nextScrollLeft = Math.max(0, targetCenter - containerRect.width / 2);

      container.scrollTo({ left: nextScrollLeft, behavior: 'smooth' });
    }
  }, [value, isScrollable]);

  return (
    <div className={classNames(styles.root, { [styles.scrollable]: isScrollable })}>
      <Grid
        container
        wrap={classNames({ nowrap: isScrollable, wrap: !isScrollable }) as GridWrap}
        className={classNames({ [styles.scrollableInner]: isScrollable })}
      >
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
            id={`${id}-${item.value}`}
            onClick={() => {
              onSetValueClick(item);
            }}
          >
            <Typography className={styles.label} whiteSpace={'nowrap'} fontFamily={'Gilroy'} fontStyle={'normal'}>
              {item.label}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Options;
