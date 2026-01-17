import { Component, JSX, createSignal, createEffect, splitProps } from 'solid-js';
import styles from './Input.module.css';
import cn from 'clsx';

interface InputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'onInput' | 'onFocus' | 'onBlur'> {
  label?: string;
  value?: string;
  onInput?: (e: InputEvent & { currentTarget: HTMLInputElement }) => void;
  onFocus?: (e: FocusEvent & { currentTarget: HTMLInputElement }) => void;
  onBlur?: (e: FocusEvent & { currentTarget: HTMLInputElement }) => void;
}

const Input: Component<InputProps> = (props) => {
  const [local, others] = splitProps(props, ['label', 'value', 'onInput', 'onFocus', 'onBlur', 'class', 'classList']);
  const [isFocused, setIsFocused] = createSignal(false);
  const [hasValue, setHasValue] = createSignal(false);
  let inputRef: HTMLInputElement | undefined;

  createEffect(() => {
    setHasValue(!!local.value && local.value.toString().length > 0);
  });

  const handleFocus = (e: FocusEvent & { currentTarget: HTMLInputElement }) => {
    setIsFocused(true);
    local.onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent & { currentTarget: HTMLInputElement }) => {
    setIsFocused(false);
    local.onBlur?.(e);
  };

  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    setHasValue(e.currentTarget.value.length > 0);
    local.onInput?.(e);
  };

  const isLabelFloating = () => isFocused() || hasValue();

  return (
    <div class={cn(styles.root, local.class)} classList={local.classList}>
      <label 
        class={styles.label}
        style={{ 'z-index': 10 }}
        classList={{ [styles.labelFloating]: isLabelFloating() }}
        for={others.id}
      >
        {local.label}
      </label>
      <div class={styles.inputContainer} classList={local.classList}>
        {local.label && (
          <>
            <div 
              class={cn(styles.label, styles.borderOverlay)}
              classList={{ [styles.labelFloating]: isLabelFloating() }}
            >
              {local.label}
            </div>
          </>
        )}
        <input
          {...others}
          ref={(el) => {
            inputRef = el;
            if (typeof others.ref === 'function') {
              others.ref(el);
            }
          }}
          value={local.value}
          placeholder={local.label ? ' ' : others.placeholder}
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          class={styles.input}
        />
      </div>
    </div>
  );
};

export default Input;
