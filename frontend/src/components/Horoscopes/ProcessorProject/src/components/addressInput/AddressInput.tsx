import React, { useCallback, useMemo, useState } from 'react';
import Input from '../input/Input';
import { InputType } from '../input/InputType';
import { Option } from '../../models/types/Option';
import { debounce } from 'lodash';
import { AddressLocation } from '../../models/types/HoroscopeAddress';
import { getLocations } from '../../api/getLocations';
import { Mutex } from 'async-mutex';

interface AddressInputProps {
  addressLocation?: AddressLocation,
  setAddressLocation?: (addressInfo: AddressLocation) => any,
  placeholder?: string,
  disabled?: boolean,
  isError?: boolean
}

const AddressInput = ({ placeholder, addressLocation, disabled, setAddressLocation, isError }: AddressInputProps) => {
  const [locations, setLocations] = useState<AddressLocation []>([]);
  const debouncedGetSuggestions = useMemo<(query: string) => void>(() => {
    const mutex = new Mutex();

    const updateSuggestions = (query: string) => {
      mutex.runExclusive(() => getLocations(query))
        .then((locations) => {
          setLocations(locations || []);
        });
    };

    return debounce(updateSuggestions, 1000);
  }, [setLocations]);

  const onChange = useCallback((value: string) => {
    debouncedGetSuggestions(value);
  }, [debouncedGetSuggestions]);

  const inputSuggestions = useMemo(() => {
    return [...locations?.map((suggestion) => ({
      label: suggestion?.value,
      value: suggestion?.key
    }))];
  }, [locations]);

  const onTargetSuggestionSet = useCallback(({ label }: Option) => {
    const addressInfo = locations.find((option) => option?.value === label);

    if (setAddressLocation && addressInfo) {
      setAddressLocation(addressInfo);
    }
  }, [locations, setAddressLocation]);

  return (
    <>
      <Input
        placeholder={placeholder || 'Место рождения'}
        options={inputSuggestions}
        targetOption={{ label: addressLocation?.value as string, value: addressLocation?.value }}
        setTargetOption={onTargetSuggestionSet}
        inputType={InputType.optionsInput}
        onChange={onChange}
        disabled={disabled}
        isError={isError}
      />
    </>
  );
};

export default AddressInput;
