import React, { useEffect, useRef } from 'react';
import { Option } from '../../models/types/Option';
import { IosSelector } from './IosSelector';
import styles from './OptionSelector.module.css';

interface OptionSelectorProps {
  options: Option[];
  value?: any;
  onChange?: (option: Option) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: 'infinite' | 'normal';
  itemHeight?: number;
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({
  options,
  value,
  onChange,
  placeholder = '',
  disabled = false,
  type = 'infinite',
  itemHeight
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<IosSelector | null>(null);
  const isUpdatingRef = useRef(false);
  const onChangeRef = useRef(onChange);

  // Keep onChange ref up to date
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!containerRef.current || disabled || options.length === 0) {
      return;
    }

    const selectorOptions = options.map(opt => ({
      value: opt.value,
      text: String(opt.label),
      disabled: opt.disabled || false
    }));

    const selectorStyles = {
      selectWrap: styles.selectWrap,
      selectOptions: styles.selectOptions,
      selectOption: styles.selectOption,
      highlight: styles.highlight,
      highlightList: styles.highlightList,
      highlightItem: styles.highlightItem,
    };

    // If selector already exists, just update source instead of recreating
    if (selectorRef.current) {
      const currentValue = selectorRef.current.value;
      selectorRef.current.updateSource(selectorOptions);
      // Try to maintain current selection if it exists in new options
      const valueExists = selectorOptions.some(opt => 
        opt.value == currentValue || String(opt.value) === String(currentValue)
      );
      if (valueExists) {
        try {
          isUpdatingRef.current = true;
          selectorRef.current.select(currentValue, true);
          setTimeout(() => {
            isUpdatingRef.current = false;
          }, 50);
        } catch (e) {
          console.warn('Failed to maintain selection:', e);
          isUpdatingRef.current = false;
        }
      }
      return;
    }

    // Find valid initial value (skip disabled options)
    const findEnabledOption = (opts: typeof selectorOptions) => {
      return opts.find(opt => !opt.disabled)?.value ?? opts[0]?.value ?? null;
    };
    
    const initialValue = value !== undefined 
      ? (selectorOptions.find(opt => (opt.value === value || opt.value == value || String(opt.value) === String(value)) && !opt.disabled)?.value ?? findEnabledOption(selectorOptions))
      : findEnabledOption(selectorOptions);

    selectorRef.current = new IosSelector({
      el: containerRef.current,
      type: type,
      source: selectorOptions,
      count: 12,
      sensitivity: 0.1,
      styles: selectorStyles,
      value: initialValue,
      itemHeight: itemHeight,
      onChange: (selected) => {
        // Prevent onChange when updating programmatically
        if (isUpdatingRef.current) {
          return;
        }
        // Prevent selection of disabled options
        if (selected.disabled) {
          return;
        }
        const option = options.find(opt => {
          // Use loose equality for comparison
          return opt.value === selected.value || opt.value == selected.value || String(opt.value) === String(selected.value);
        });
        if (option && !option.disabled && onChangeRef.current) {
          onChangeRef.current(option);
        }
      }
    });

    return () => {
      selectorRef.current?.destroy();
      selectorRef.current = null;
    };
  }, [options, disabled, type]);

  useEffect(() => {
    if (!selectorRef.current || value === undefined || options.length === 0) {
      return;
    }

    const selectorOptions = options.map(opt => ({
      value: opt.value,
      text: String(opt.label),
      disabled: opt.disabled || false
    }));
    
    // Check if value exists in options before selecting
    const optionExists = selectorOptions.some(opt => {
      // Use loose equality for comparison to handle string/number mismatches
      return opt.value == value || String(opt.value) === String(value);
    });
    
    if (optionExists) {
      // Check if value is already selected to avoid unnecessary updates
      const currentValue = selectorRef.current.value;
      if (currentValue == value || String(currentValue) === String(value)) {
        return;
      }
      try {
        isUpdatingRef.current = true;
        // Find the actual value from options to ensure exact match
        const matchingOption = selectorOptions.find(opt => 
          opt.value == value || String(opt.value) === String(value)
        );
        // Don't select disabled options
        if (matchingOption && !matchingOption.disabled) {
          selectorRef.current.select(matchingOption.value, true);
        } else if (matchingOption?.disabled) {
          // If trying to select disabled option, find next enabled one
          const findEnabledOption = selectorOptions.find(opt => !opt.disabled);
          if (findEnabledOption) {
            selectorRef.current.select(findEnabledOption.value, true);
          }
        }
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 100);
      } catch (e) {
        console.warn('Failed to select value:', value, e);
        isUpdatingRef.current = false;
      }
      } else {
        // Update source if options changed
        selectorRef.current.updateSource(selectorOptions);
      // Select first enabled option if current value doesn't exist
      const findEnabledOption = selectorOptions.find(opt => !opt.disabled);
      if (findEnabledOption) {
        isUpdatingRef.current = true;
        selectorRef.current.select(findEnabledOption.value, true);
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 100);
      }
    }
  }, [value, options]);

  if (disabled || options.length === 0) {
    return (
      <div className={styles.disabledContainer}>
        <div className={styles.placeholder}>{placeholder}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {placeholder && <div className={styles.placeholder}>{placeholder}</div>}
      <div ref={containerRef} className={styles.selectorWrapper}></div>
    </div>
  );
};
