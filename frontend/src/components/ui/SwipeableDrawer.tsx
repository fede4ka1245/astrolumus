import { Component, JSX, Show, createSignal, onMount, onCleanup } from 'solid-js';

interface SwipeableDrawerProps {
  anchor?: 'top' | 'bottom' | 'left' | 'right';
  open: boolean;
  onClose: () => void;
  onOpen?: () => void;
  children: JSX.Element;
  disableSwipeToOpen?: boolean;
  container?: HTMLElement;
  swipeAreaWidth?: number;
  keepMounted?: boolean;
  PaperProps?: { style?: JSX.CSSProperties };
}

const SwipeableDrawer: Component<SwipeableDrawerProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(props.open);
  const [startY, setStartY] = createSignal(0);
  const [currentY, setCurrentY] = createSignal(0);
  const [isDragging, setIsDragging] = createSignal(false);
  let drawerRef: HTMLDivElement | undefined;
  let backdropRef: HTMLDivElement | undefined;

  const handleTouchStart = (e: TouchEvent) => {
    if (props.anchor === 'bottom' && e.touches[0].clientY < 100) {
      setIsDragging(true);
      setStartY(e.touches[0].clientY);
      setCurrentY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging() && props.anchor === 'bottom') {
      const deltaY = e.touches[0].clientY - startY();
      if (deltaY > 0) {
        setCurrentY(e.touches[0].clientY);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isDragging()) {
      const deltaY = currentY() - startY();
      if (deltaY > 50) {
        props.onClose();
      }
      setIsDragging(false);
      setCurrentY(0);
    }
  };

  onMount(() => {
    setIsOpen(props.open);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  });

  onCleanup(() => {
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  });

  const handleBackdropClick = () => {
    props.onClose();
  };

  return (
    <Show when={isOpen() || props.keepMounted}>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          'z-index': 1300,
          display: isOpen() ? 'block' : 'none',
        }}
      >
        <div
          ref={backdropRef}
          onClick={handleBackdropClick}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            'background-color': 'rgba(0, 0, 0, 0.5)',
            transition: 'opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          }}
        />
        <div
          ref={drawerRef}
          style={{
            position: 'absolute',
            [props.anchor || 'bottom']: isDragging() ? `${currentY() - startY()}px` : 0,
            left: props.anchor === 'left' ? 0 : props.anchor === 'right' ? 'auto' : 0,
            right: props.anchor === 'right' ? 0 : 'auto',
            top: props.anchor === 'top' ? 0 : props.anchor === 'bottom' ? 'auto' : 0,
            bottom: props.anchor === 'bottom' ? 0 : 'auto',
            width: props.anchor === 'left' || props.anchor === 'right' ? 'auto' : '100%',
            height: props.anchor === 'top' || props.anchor === 'bottom' ? 'auto' : '100%',
            'max-height': props.anchor === 'bottom' ? '90vh' : 'auto',
            'max-width': props.anchor === 'left' || props.anchor === 'right' ? '90vw' : 'auto',
            'background-color': '#fff',
            'box-shadow': '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)',
            transition: isDragging() ? 'none' : 'transform 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            transform: isOpen() ? 'translateY(0)' : `translateY(${props.anchor === 'bottom' ? '100%' : props.anchor === 'top' ? '-100%' : '0'})`,
            ...props.PaperProps?.style,
          }}
        >
          {props.children}
        </div>
      </div>
    </Show>
  );
};

export default SwipeableDrawer;
