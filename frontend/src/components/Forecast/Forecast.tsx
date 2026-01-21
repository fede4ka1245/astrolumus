import { Component, createSignal, onMount, Show, createEffect, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';
import styles from './Forecast.module.css';
import Loader from '../Loader/Loader';
import Horoscope from '../Horoscopes/index';

export interface ForecastProps {
  question: string;
  date: Date | null;
  place: {
    name: string;
    lat: number;
    lon: number;
  } | null;
  onLoadComplete?: () => void;
}

declare global {
  interface Window {
    ProcessorProject?: {
      finishLoading: () => void;
    };
  }
}

const Forecast: Component<ForecastProps> = (props) => {
  const [isLoading, setIsLoading] = createSignal(true);
  const [opacity, setOpacity] = createSignal(0);
  const [activeSection, setActiveSection] = createSignal<'answer' | 'chart'>('answer');
  let tabsRef: HTMLDivElement | undefined;

  onMount(() => {
    if (typeof window !== 'undefined') {
      window.ProcessorProject = {
        finishLoading: () => {
          setIsLoading(false);
          setOpacity(1);
          props.onLoadComplete?.();
        }
      };
    }
  });

  onCleanup(() => {
    if (typeof window !== 'undefined' && window.ProcessorProject) {
      delete window.ProcessorProject;
    }
  });

  createEffect(() => {
    if (!isLoading() && tabsRef && activeSection()) {
      requestAnimationFrame(() => {
        const activeTab = tabsRef?.querySelector(`[data-section="${activeSection()}"]`) as HTMLElement;
        if (activeTab) {
          activeTab.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }
      });
    }
  });

  return (
    <div class={styles.forecast}>
      <Portal>
        <div
          style={`position: fixed; width: 120px; height: 120px; top: calc(50vh - 60px); left: calc(50vw - 60px); display: flex; align-items: center; justify-content: center; z-index: 100000; opacity: ${isLoading() ? 1 : 0}; transition: opacity 0.5s ease-in-out; pointer-events: ${isLoading() ? 'auto' : 'none'};`}
        >
          <Loader />
        </div>
      </Portal>
      <div
        style={`opacity: ${opacity()}; transition: opacity 0.5s ease-in-out;`}
      >
        <Horoscope />
      </div>
    </div>
  );
};

export default Forecast;
