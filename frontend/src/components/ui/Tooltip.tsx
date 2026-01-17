import { Component, JSX, Show, createSignal, onMount, onCleanup } from 'solid-js';

interface TooltipProps {
  title: JSX.Element;
  open?: boolean;
  onClose?: () => void;
  disableFocusListener?: boolean;
  disableHoverListener?: boolean;
  disableTouchListener?: boolean;
  arrow?: boolean;
  children: JSX.Element;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: Component<TooltipProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(props.open || false);
  let tooltipRef: HTMLDivElement | undefined;
  let triggerRef: HTMLDivElement | undefined;

  const handleMouseEnter = () => {
    if (!props.disableHoverListener) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!props.disableHoverListener) {
      setIsOpen(false);
      props.onClose?.();
    }
  };

  const handleFocus = () => {
    if (!props.disableFocusListener) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    if (!props.disableFocusListener) {
      setIsOpen(false);
      props.onClose?.();
    }
  };

  const handleTouchStart = () => {
    if (!props.disableTouchListener) {
      setIsOpen(true);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      tooltipRef &&
      triggerRef &&
      !tooltipRef.contains(event.target as Node) &&
      !triggerRef.contains(event.target as Node)
    ) {
      setIsOpen(false);
      props.onClose?.();
    }
  };

  onMount(() => {
    if (props.open !== undefined) {
      setIsOpen(props.open);
    }
    document.addEventListener('mousedown', handleClickOutside);
  });

  onCleanup(() => {
    document.removeEventListener('mousedown', handleClickOutside);
  });

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onTouchStart={handleTouchStart}
        style={{ display: 'inline-block' }}
      >
        {props.children}
      </div>
      <Show when={isOpen()}>
        <div
          ref={tooltipRef}
          style={{
            position: 'absolute',
            'z-index': 1500,
            padding: '4px 8px',
            'background-color': 'rgba(97, 97, 97, 0.9)',
            color: 'white',
            'border-radius': '4px',
            'font-size': '0.75rem',
            'max-width': '300px',
            'word-wrap': 'break-word',
            bottom: props.placement === 'top' ? '100%' : 'auto',
            top: props.placement === 'bottom' ? '100%' : 'auto',
            left: props.placement === 'right' ? '100%' : 'auto',
            right: props.placement === 'left' ? '100%' : 'auto',
            'margin-bottom': props.placement === 'top' ? '8px' : '0',
            'margin-top': props.placement === 'bottom' ? '8px' : '0',
            'margin-left': props.placement === 'right' ? '8px' : '0',
            'margin-right': props.placement === 'left' ? '8px' : '0',
            transform: props.placement === 'top' ? 'translateX(-50%)' : props.placement === 'bottom' ? 'translateX(-50%)' : 'none',
            left: props.placement === 'top' || props.placement === 'bottom' ? '50%' : 'auto',
          }}
        >
          {props.arrow && (
            <div
              style={{
                position: 'absolute',
                width: 0,
                height: 0,
                'border-style': 'solid',
                'border-width': '5px',
                'border-color': props.placement === 'top'
                  ? 'rgba(97, 97, 97, 0.9) transparent transparent transparent'
                  : props.placement === 'bottom'
                  ? 'transparent transparent rgba(97, 97, 97, 0.9) transparent'
                  : props.placement === 'left'
                  ? 'transparent transparent transparent rgba(97, 97, 97, 0.9)'
                  : 'transparent rgba(97, 97, 97, 0.9) transparent transparent',
                bottom: props.placement === 'top' ? '-10px' : 'auto',
                top: props.placement === 'bottom' ? '-10px' : 'auto',
                left: props.placement === 'right' ? '-10px' : 'auto',
                right: props.placement === 'left' ? '-10px' : 'auto',
                transform: 'translateX(-50%)',
                left: '50%',
              }}
            />
          )}
          {props.title}
        </div>
      </Show>
    </div>
  );
};

export default Tooltip;
