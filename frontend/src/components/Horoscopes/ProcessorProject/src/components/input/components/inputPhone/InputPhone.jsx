import React, { useCallback } from 'react';
import InputMask from 'react-input-mask';

// eslint-disable-next-line react/prop-types
const InputTime = ({ value, onChange, onBlur, onFocus, ...props }) => {
  const _onFocus = useCallback(() => {
    if (onFocus) {
      onFocus();
    }
  }, [onFocus]);

  const _onBlur = useCallback(() => {
    if (onBlur) {
      onBlur();
    }
  }, [onBlur]);

  const onInputChange = useCallback((event) => {
    onChange(event.target.value.replace(/[^\d]/g, ''));
  }, [onChange]);

  return (
    <>
      <InputMask
        onChange={onInputChange}
        mask="+7 999 999-99-99"
        className="form__input"
        id="reg_phone"
        type="tel"
        name="phone_number"
        value={value}
        {...props}
        maskChar={null}
        onFocus={_onFocus}
        onBlur={_onBlur}
      />
    </>
  );
};

export default InputTime;
