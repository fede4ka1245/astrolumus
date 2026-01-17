import React from 'react';

type CallBack = () => any;
type TapParams = { onSingleTap?: CallBack; onDoubleTap?: CallBack };

const DELTA_TIME_THRESHOLD_MS = 700;
let timer: any = null;
let target: EventTarget;

export function tap (
  e: React.MouseEvent,
  { onSingleTap, onDoubleTap }: TapParams
) {
  if (timer == null) {
    // First tap
    onSingleTap?.();

    timer = setTimeout(() => {
      timer = null;
    }, DELTA_TIME_THRESHOLD_MS);
  } else {
    // Second tap
    if (e.target === target) {
      onDoubleTap?.();
    }

    clearTimeout(timer);
    timer = null;
  }
  target = e.target;
}
