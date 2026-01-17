import React, { useCallback } from 'react';
import { OptionsProps } from './OptionsProps';
import { Option } from '../../../../models/types/Option';
import styles from './Options.module.scss';
import DarkThemeBackground from '../../../darkThemeBackground/DarkThemeBackground';
import classNames from 'classnames';
import Modal from '../../../modal/Modal';

const Options = ({ isOpen, setTargetOption, close, options, isDark }: OptionsProps) => {
  const onOptionClick = useCallback((option: Option) => {
    if (!setTargetOption) {
      return;
    }

    setTargetOption(option);
  }, [setTargetOption]);

  return (
    <Modal
      isOpen={isOpen}
      close={() => close()}
      height={'calc(100vh - 300px)'}
      isDark={isDark}
    >
      {isDark && (
        <DarkThemeBackground>
          <section className={classNames(styles.main, { [styles.dark]: isDark })}>
            {
              options?.map((option: Option, index) => (
                <div key={index} onClick={() => onOptionClick(option)}>
                  {option.label}
                </div>
              ))
            }
          </section>
        </DarkThemeBackground>
      )}
      {!isDark && (
        <section className={styles.main}>
          {
            options?.map((option: Option, index) => (
              <div key={index} onClick={() => onOptionClick(option)}>
                {option.label}
              </div>
            ))
          }
        </section>
      )}
    </Modal>
  );
};

export default Options;
