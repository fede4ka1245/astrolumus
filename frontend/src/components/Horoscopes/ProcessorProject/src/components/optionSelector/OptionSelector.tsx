import React, { useEffect, useRef } from 'react';
import { Option } from '../../models/types/Option';
import { IosSelector } from './IosSelector';
import styles from './OptionSelector.module.css';
import classNames from 'classnames';

interface OptionSelectorProps {
  options: Option[];
  value?: any;
  onChange?: (option: Option) => void;
  placeholder?: string;
  placeholderShort?: string;
  disabled?: boolean;
  type?: 'infinite' | 'normal';
  itemHeight?: number;
  compact?: boolean;
  centered?: boolean;
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({
  options,
  value,
  onChange,
  placeholder = '',
  placeholderShort,
  disabled = false,
  type = 'infinite',
  itemHeight,
  compact = false,
  centered = false
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

  const stepBy = (delta: number) => {
    const selector = selectorRef.current;
    if (!selector) {
      return;
    }

    const source = selector.source || [];
    if (!source.length) {
      return;
    }

    let nextScroll = selector.scroll + delta;
    const max = source.length;
    let attempts = 0;

    while (attempts < max) {
      const idx = selector.type === 'infinite'
        ? ((nextScroll % max) + max) % max
        : Math.max(0, Math.min(max - 1, nextScroll));

      if (!source[idx]?.disabled) {
        nextScroll = idx;
        break;
      }

      nextScroll += delta;
      attempts += 1;
    }

    // Animate a single-step scroll and then finalize selection.
    (selector as any)
      ._animateToScroll(selector.scroll, nextScroll, 0.12, 'easeOutQuart')
      .then(() => {
        (selector as any)._selectByScroll(nextScroll);
      });
  };

  return (
    <div className={classNames(styles.container, { [styles.compact]: compact, [styles.centered]: centered })}>
      {placeholder && (
        <div className={styles.placeholder}>
          {placeholderShort ? (
            <>
              <span className={styles.placeholderLong}>{placeholder}</span>
              <span className={styles.placeholderShort}>{placeholderShort}</span>
            </>
          ) : (
            placeholder
          )}
        </div>
      )}
      <div ref={containerRef} className={styles.selectorWrapper}></div>
      <button className={`${styles.arrow} ${styles.arrowUp}`} type="button" onClick={() => stepBy(-1)}>
        <svg width="14" height="14" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M1 6.5L5.18338 1.50905C5.36756 1.32662 5.63244 1.32662 5.81662 1.50905L10 6.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        </svg>
      </button>
      <button className={`${styles.arrow} ${styles.arrowDown}`} type="button" onClick={() => stepBy(1)}>
        <svg width="14" height="14" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M1 1.5L5.18338 6.49095C5.36756 6.67338 5.63244 6.67338 5.81662 6.49095L10 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
};
