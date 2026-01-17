import { Component, JSX, Show, createSignal, createEffect, onCleanup } from 'solid-js';
import styles from './Modal.module.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element;
}

const Modal: Component<ModalProps> = (props) => {
  const [isClosing, setIsClosing] = createSignal(false);
  const [shouldRender, setShouldRender] = createSignal(false);
  let closeTimer: number | null = null;

  createEffect(() => {
    if (props.isOpen) {
      // Очищаем таймер если он был установлен
      if (closeTimer !== null) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      setIsClosing(false);
      setShouldRender(true);
    } else if (shouldRender() && !isClosing()) {
      // Начинаем анимацию закрытия
      setIsClosing(true);
      closeTimer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
        closeTimer = null;
      }, 300);
    }
  });

  onCleanup(() => {
    if (closeTimer !== null) {
      clearTimeout(closeTimer);
    }
  });

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  const handleClose = () => {
    props.onClose();
  };

  return (
    <Show when={shouldRender()}>
      <div 
        class={styles.modalOverlay} 
        classList={{ [styles.modalOverlayClosing]: isClosing() }}
        onClick={handleBackdropClick}
      >
        <div 
          class={styles.modalContainer}
          classList={{ [styles.modalContainerClosing]: isClosing() }}
        >
          <button 
            class={styles.closeButton} 
            onClick={handleClose}
            aria-label="Закрыть модальное окно"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class={styles.modalContent}>
            {props.children}
          </div>
        </div>
      </div>
    </Show>
  );
};

export default Modal;
