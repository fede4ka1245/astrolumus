import { Component, createSignal, onCleanup, onMount, Show } from 'solid-js';
import styles from './Horoscopes.module.css';

declare global {
  interface Window {
    horoscopesMount?: (element: HTMLElement) => { unmount: () => void };
  }
}

const SCRIPT_ID = 'horoscopes-mount-script';
const STYLE_ID = 'horoscopes-mount-style';
const SCRIPT_SRC = '/horoscopes-build/assets/mount.js';
const STYLE_HREF = '/horoscopes-build/assets/mount.css';

const ensureMountStyles = () => {
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = STYLE_HREF;
  document.head.appendChild(link);
};

const loadMountScript = () => {
  if (window.horoscopesMount) {
    return Promise.resolve();
  }

  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    return new Promise<void>((resolve, reject) => {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Mount script failed to load.')));
    });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'module';
    script.src = SCRIPT_SRC;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Mount script failed to load.'));
    ensureMountStyles();
    document.head.appendChild(script);
  });
};

const Horoscopes: Component = () => {
  const [error, setError] = createSignal<string | null>(null);
  let containerRef: HTMLDivElement | undefined;
  let cleanup: (() => void) | undefined;

  onMount(async () => {
    if (!containerRef) {
      return;
    }

    try {
      ensureMountStyles();
      await loadMountScript();
      const mount = window.horoscopesMount;
      if (!mount) {
        throw new Error('Mount function not found.');
      }
      cleanup = mount(containerRef).unmount;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error while mounting.';
      setError(message);
    }
  });

  onCleanup(() => {
    if (cleanup) {
      cleanup();
    }
  });

  return (
    <div class={styles.container} style={{ position: 'relative', width: '100%' }}>
      <Show when={!error()} fallback={<div>{error()}</div>}>
        <div ref={(el) => (containerRef = el)} />
      </Show>
    </div>
  );
};

export default Horoscopes;
