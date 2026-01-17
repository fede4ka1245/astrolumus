import { Component, JSX, createSignal, createEffect, splitProps } from 'solid-js';
import styles from './Textarea.module.css';
import cn from 'clsx';

interface TextareaProps extends Omit<JSX.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onInput' | 'onFocus' | 'onBlur'> {
  label?: string;
  value?: string;
  parentRef?: (el: HTMLDivElement) => void;
  onInput?: (e: InputEvent & { currentTarget: HTMLTextAreaElement }) => void;
  onFocus?: (e: FocusEvent & { currentTarget: HTMLTextAreaElement }) => void;
  onBlur?: (e: FocusEvent & { currentTarget: HTMLTextAreaElement }) => void;
}

const Textarea: Component<TextareaProps> = (props) => {
  const [local, others] = splitProps(props, ['label', 'value', 'parentRef', 'onInput', 'onFocus', 'onBlur', 'class', 'classList']);
  const [isFocused, setIsFocused] = createSignal(false);
  const [hasValue, setHasValue] = createSignal(false);
  let textareaRef: HTMLTextAreaElement | undefined;

  createEffect(() => {
    setHasValue(!!local.value && local.value.toString().length > 0);
  });

  const handleFocus = (e: FocusEvent & { currentTarget: HTMLTextAreaElement }) => {
    setIsFocused(true);
    local.onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent & { currentTarget: HTMLTextAreaElement }) => {
    setIsFocused(false);
    local.onBlur?.(e);
  };

  const handleInput = (e: InputEvent & { currentTarget: HTMLTextAreaElement }) => {
    setHasValue(e.currentTarget.value.length > 0);
    local.onInput?.(e);
  };

  const isLabelFloating = () => isFocused() || hasValue();

  return (
    <div ref={local.parentRef} class={cn(styles.root, local.class)} classList={local.classList}>
      <label 
        class={styles.label}
        style={{ 'z-index': 10 }}
        classList={{ [styles.labelFloating]: isLabelFloating() }}
        for={others.id}
      >
        {local.label}
      </label>
      <div class={styles.textareaContainer} classList={local.classList}>
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
        <textarea
          {...others}
          ref={(el) => {
            textareaRef = el;
            if (typeof others.ref === 'function') {
              others.ref(el);
            }
          }}
          value={local.value}
          placeholder={local.label ? ' ' : others.placeholder}
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          class={styles.textarea}
        />
      </div>
    </div>
  );
};

export default Textarea;
