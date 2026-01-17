/* eslint-disable */
import React, { useCallback, useMemo, useState } from 'react';
import InputMask from 'react-input-mask';
import {Box, ClickAwayListener, Drawer, Grid, TextField} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ruLocale from 'date-fns/locale/ru';
import moment from 'moment';
import { StaticTimePicker } from '@mui/x-date-pickers';
import Modal from "../../../modal/Modal";
import timePickerImage from "./timePicker.svg";
import {StaticDatePicker} from "@mui/x-date-pickers/StaticDatePicker";
import IconButton from "../../../iconButton/IconButton";
import arrowImage from "../../assets/arrow.svg";
import {useSearchParamsState} from "../../../../hooks/useSearchParamsState";

// eslint-disable-next-line react/prop-types
const InputTime = ({ value, onChange, onFocus, shouldDisableTime, ...props }) => {
  const [isOpen, setIsOpen] = useSearchParamsState('isInputTimeOpen', false, true);

  const onDateChange = useCallback((date) => {
    const formattedDate = moment(date).format('HH:mm:ss');

    onChange(formattedDate);
  }, []);

  const onClickAway = useCallback(() => {
    setIsOpen(false);
  }, []);

  const timePickerValue = useMemo(() => {
    if (!value || !value.includes(':') || value?.split(':')?.length < 2) {
      return null;
    }

    const [hour, minutes, seconds] = value.split(':');
    return new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), hour, minutes, seconds);
  }, [value]);

  const beforeMaskedValueChange = useCallback((newState, oldState, userInput) => {
    let { value: _value } = newState;
    let selection = newState.selection;
    let cursorPosition = selection ? selection.start : null;

    // keep minus if entered by user
    if (_value.endsWith(':') && userInput !== ':' && value.endsWith(':')) {
      if (cursorPosition === _value.length) {
        cursorPosition--;
        selection = { start: cursorPosition, end: cursorPosition };
      }
      _value = _value.slice(0, -1);
    }

    return {
      value: _value,
      selection
    };
  }, [])

  const onBlur = useCallback(() => {
    if (props.onBlur) {
      props.onBlur()
    }

    if (!value.includes(':')) {
      return;
    }

    const hours = value.split(':')[0] || '00';
    const minutes = value.split(':')[1] || '00';
    const seconds = value.split(':')[2] || '00';

    if (value.endsWith(':')) {
      onChange(`${hours}:${minutes}:${seconds}`);
    }
  }, [value, props, onChange])

  return (
    <>
      <Grid container display={'flex'} alignItems={'center'} height={'100%'}>
        <Grid item flex={1} height={'100%'}>
          <InputMask
            maskChar={null}
            onChange={(event) => onChange(event.target.value)}
            mask="99:99:99"
            value={value}
            {...props}
            autoComplete="new-password"
            type="tel"
            beforeMaskedValueChange={beforeMaskedValueChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </Grid>
        <Grid item pr={'8px'} pl={'5px'}>
          <IconButton onClick={() => setIsOpen(true)}>
            <img src={timePickerImage} />
          </IconButton>
        </Grid>
      </Grid>
      <Drawer anchor={'bottom'} open={isOpen} close={() => setIsOpen(false)} height={'400px'}>
        <ClickAwayListener onClickAway={onClickAway}>
          <Box pl={2} pr={2} pt={3}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={ruLocale} // use 'bg' locale for date parser/formatter
            >
              <StaticTimePicker
                sx={{background: '#f0f0f3'}}
                displayStaticWrapperAs="desktop"
                onChange={(date) => onDateChange(date)}
                value={timePickerValue}
                openTo={'hours'}
                shouldDisableTime={shouldDisableTime}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
        </ClickAwayListener>
      </Drawer>
    </>
  );
};

export default InputTime;
