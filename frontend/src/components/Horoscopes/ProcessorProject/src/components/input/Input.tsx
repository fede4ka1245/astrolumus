import React, { ForwardedRef, useCallback, useEffect, useMemo, useState } from 'react';
import styles from './Input.module.scss';
import { InputProps } from './InputProps';
import classNames from 'classnames';
import { InputStyle } from './InputStyle';
import { Option } from '../../models/types/Option';
import Options from './components/options/Options';
import { InputType } from './InputType';
import InputDate from './components/inputDate/InputDate';
import InputTime from './components/inputTime/InputTime';
import InputPhone from './components/inputPhone/InputPhone';
import { Grid, TextareaAutosize } from '@mui/material';
import arrowImage from './assets/arrow.svg';
import InputOptions from './components/inputOptions/InputOptions';
import Modal from '../modal/Modal';
// @ts-ignore
import InputMask from 'react-input-mask';
import IconButton from '../iconButton/IconButton';

const Input = (props : InputProps, ref: ForwardedRef<any>) => {
  const { placeholder, textError, isError, inputType, onChange, inputProps, value, setTargetOption, targetOption, options, disablePast, shouldDisableTime, inputStyle, width, height, disabled, type, maxRows, minHeight } = props;
  const [isFocused, setIsFocused] = useState(false);
  const [inputLabel, setInputLabel] = useState(value);
  const [isOptionsActive, setIsOptionsActive] = useState(false);
  const [option, setOption] = useState(targetOption);
  const [isOptionsInputOpen, setIsOptionsInputOpen] = useState(false);

  const toggleIsOptionsInputOpen = useCallback(() => {
    setIsOptionsInputOpen(prevState => !prevState);
  }, []);

  const toggleIsOptionActive = useCallback(() => {
    if (inputType === InputType.optionsInput && !isOptionsInputOpen) {
      toggleIsOptionsInputOpen();
      return;
    }

    if (inputType !== InputType.options) {
      return;
    }

    if (isOptionsActive) {
      setIsOptionsActive(false);
    } else {
      setIsOptionsActive(true);
    }
  }, [inputType, isOptionsActive, isOptionsInputOpen, toggleIsOptionsInputOpen]);

  const onOptionSet = useCallback((option: Option) => {
    setOption(option);

    if (!setTargetOption) {
      return;
    }

    setTargetOption(option);
  }, [setTargetOption]);

  useEffect(() => {
    setInputLabel(value);
  }, [value]);

  const onInputChange = useCallback((value: string) => {
    if (onChange) {
      onChange(value);
    }
    setInputLabel(value);
  }, [onChange]);

  const isBottom = useMemo(() => {
    return !(!!value || !!targetOption?.label || !!option?.label || !!inputLabel && inputType !== InputType.coordinates || isFocused);
  }, [inputLabel, inputType, isFocused, option?.label, targetOption?.label, value]);

  const onCoordinatesInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(event.target.value.replaceAll(',', '.').replace(/[^\d.-]/g, ''));
  }, [onInputChange]);

  return (
    <section
      onClick={toggleIsOptionActive}
      className={classNames(
        { [styles.textarea]: inputType === InputType.textarea },
        { [styles.input]: inputType !== InputType.textarea },
        { [styles.filled]: inputStyle !== InputStyle.outlined || !isBottom },
        { [styles.outlined]: inputStyle === InputStyle.outlined && isBottom },
        { [styles.disabled]: disabled && inputStyle !== InputStyle.outlined },
        { [styles.outlinedDisabled]: disabled && inputStyle === InputStyle.outlined }
      )}
      style={{ width, height }}
    >
      {isError && <div className={styles.textError}>
        {textError || '*'}
      </div>}
      {inputType === InputType.optionsInput && <>
        <Modal isOpen={isOptionsInputOpen} close={toggleIsOptionsInputOpen} height={'calc(100% - 60px)'}>
          <InputOptions
            options={options}
            onChange={onChange}
            setTargetOption={onOptionSet}
            close={toggleIsOptionsInputOpen}
            placeholder={placeholder}
          />
        </Modal>
      </>}
      {inputType === InputType.date && <InputDate
        disablePast={disablePast}
        value={inputLabel}
        onChange={onInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={classNames(styles.input)}
      />}
      {inputType === InputType.time && <InputTime
        shouldDisableTime={shouldDisableTime}
        value={inputLabel}
        onChange={onInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={classNames(styles.input)}
      />}
      {inputType === InputType.phone && <InputPhone
        value={value}
        onChange={onInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={classNames(styles.input)}
      />}
      {inputType === InputType.textarea && <textarea
        value={value}
        onChange={(event) => onInputChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={classNames(styles.textarea)}
        autoComplete="new-password"
      />}
      {inputType === InputType.textareaAutosize && <TextareaAutosize
        value={value}
        ref={ref}
        style={{
          minHeight: minHeight ?? 'auto',
          paddingTop: placeholder && (placeholder?.length > 33 ? 25 : 15)
        }}
        maxRows={maxRows}
        onChange={(event) => onInputChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={classNames(styles.textareaAutosize)}
      />}
      {inputType === InputType.coordinates && <input
        onChange={onCoordinatesInputChange}
        value={value}
        type="text"
        inputMode="decimal"
      />}
      {inputType === InputType.coordinatesLongitude && <input
        onChange={onCoordinatesInputChange}
        value={value}
        type="text"
        inputMode="decimal"
      />}
      {!inputType && <input
        onChange={(event) => onInputChange(event.target.value)}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        ref={ref}
        {...inputProps}
        autoComplete="new-password"
        type={type}
      />}
      {(inputType === InputType.options || inputType === InputType.optionsInput) && (<>
        <Grid container display={'flex'} alignItems={'center'} wrap={'nowrap'} height={'50px'}>
          <Grid item flex={1} className={styles.selectLabel}>
            {targetOption ? targetOption.label : option?.label}
          </Grid>
          <Grid item pl={'5px'} pr={'8px'}>
            <IconButton onClick={toggleIsOptionActive}>
              <img src={arrowImage}/>
            </IconButton>
          </Grid>
        </Grid>
        <Options isDark isOpen={isOptionsActive} setTargetOption={onOptionSet} close={toggleIsOptionActive} options={options}/>
      </>)}
      <label className={classNames(styles.placeholder, { [styles.bottom]: isBottom }, { [styles.top]: !isBottom })}>
        {placeholder}
      </label>
    </section>
  );
};

export default React.forwardRef(Input);
