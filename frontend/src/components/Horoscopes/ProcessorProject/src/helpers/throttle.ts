export function throttle (callback: (props: any) => any, limit: number) {
  let waiting = false;
  return function throttled () {
    if (!waiting) {
      // @ts-ignore
      callback.apply(this, arguments);
      waiting = true;
      setTimeout(function () {
        waiting = false;
      }, limit);
    }
  };
}
