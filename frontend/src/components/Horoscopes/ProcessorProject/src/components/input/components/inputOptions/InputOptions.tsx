import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Grid } from '@mui/material';
import { Option } from '../../../../models/types/Option';
import Input from '../../Input';
import styles from './InputOptions.module.scss';
import { InputStyle } from '../../InputStyle';
import ButtonClose from '../../../buttonClose/ButtonClose';

export type InputOptionsProps = {
  placeholder?: string,
  onChange?: (value: string) => any,
  value?: string,
  options?: Array<Option>
  setTargetOption?: Function,
  close?: (props?: any) => any,
}

const InputOptions = ({ options, onChange, placeholder, setTargetOption, close }: InputOptionsProps) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<any>();

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current && typeof inputRef.current.focus === 'function') {
        inputRef.current.focus();
      }
    }, 200);
  }, []);

  const onOptionClick = useCallback(({ label, value }: Option) => {
    if (setTargetOption) {
      setTargetOption({ label, value });
    }

    if (close) {
      close();
    }
  }, [close, setTargetOption]);

  const onInputChange = useCallback((value: string) => {
    setValue(value);

    if (onChange) {
      onChange(value);
    }
  }, [onChange]);

  return (
    <>
      <Grid item p={2} display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <Grid flex={1}>
          <Input
            value={value}
            onChange={onInputChange}
            ref={inputRef}
            placeholder={placeholder}
            inputStyle={InputStyle.outlined}
          />
        </Grid>
        <Grid zIndex={4} pl={2}>
          <ButtonClose onClick={close} />
        </Grid>
      </Grid>
      <Grid container direction={'column'} overflow={'scroll'} wrap={'nowrap'}>
        {options?.map(({ label, value }, index) => (
          <Grid item key={`${label} ${index}`}>
            <section className={styles.option} onClick={() => onOptionClick({ label, value })}>
              {label}
            </section>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default InputOptions;
