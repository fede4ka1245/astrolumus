import { Component, JSX, onMount, onCleanup } from 'solid-js';

interface ClickAwayListenerProps {
  onClickAway: (event: MouseEvent | TouchEvent) => void;
  children: JSX.Element;
}

const ClickAwayListener: Component<ClickAwayListenerProps> = (props) => {
  let containerRef: HTMLDivElement | undefined;

  const handleClickAway = (event: MouseEvent | TouchEvent) => {
    if (containerRef && !containerRef.contains(event.target as Node)) {
      props.onClickAway(event);
    }
  };

  onMount(() => {
    document.addEventListener('mousedown', handleClickAway);
    document.addEventListener('touchstart', handleClickAway);
  });

  onCleanup(() => {
    document.removeEventListener('mousedown', handleClickAway);
    document.removeEventListener('touchstart', handleClickAway);
  });

  return (
    <div ref={containerRef} style={{ display: 'inline-block' }}>
      {props.children}
    </div>
  );
};

export default ClickAwayListener;
