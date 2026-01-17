import { Component, createSignal, onMount, Show, createEffect } from 'solid-js';
import styles from './Forecast.module.css';
import Loader from '../Loader/Loader';

export interface ForecastProps {
  question: string;
  date: Date | null;
  place: {
    name: string;
    lat: number;
    lon: number;
  } | null;
}

const Forecast: Component<ForecastProps> = (props) => {
  const [isLoading, setIsLoading] = createSignal(true);
  const [activeSection, setActiveSection] = createSignal<'answer' | 'chart'>('answer');
  let tabsRef: HTMLDivElement | undefined;

  onMount(() => {
    // Имитируем загрузку в течение 2 секунд
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
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
      <Show when={isLoading()} fallback={
        <div class={styles.content}>
          <div class={styles.sectionTabs} ref={(el) => tabsRef = el}>
            <button
              class={styles.sectionTab}
              classList={{ [styles.sectionTabActive]: activeSection() === 'answer' }}
              onClick={() => setActiveSection('answer')}
              data-section="answer"
              aria-label="Переключить на раздел 'Ответ на вопрос'"
              aria-pressed={activeSection() === 'answer'}
            >
              Ответ на вопрос
            </button>
            <button
              class={styles.sectionTab}
              classList={{ [styles.sectionTabActive]: activeSection() === 'chart' }}
              onClick={() => setActiveSection('chart')}
              data-section="chart"
              aria-label="Переключить на раздел 'Натальная карта'"
              aria-pressed={activeSection() === 'chart'}
            >
              Натальная карта
            </button>
          </div>
          
          <div class={styles.sectionContent}>
            <Show when={activeSection() === 'answer'}>
              <div class={styles.answerSection}>
                <p class={styles.answerText}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
                <br />
                <p class={styles.answerText}>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
                <br />
                <p class={styles.answerText}>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
                </p>
              </div>
            </Show>
            
            <Show when={activeSection() === 'chart' && props.place && props.date}>
              <div class={styles.chartSection}>
                {/* <Horoscope
                  birthPlace={{
                    name: props.place?.name || '',
                    latitude: props.place?.lat || 0,
                    longitude: props.place?.lon || 0
                  }}
                  birthDate={props.date ? props.date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.') : ''}
                  birthTime={props.date ? props.date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : ''}
                /> */}
              </div>
            </Show>
          </div>
        </div>
      }>
        <div class={styles.loaderContainer}>
          <Loader />
        </div>
      </Show>
    </div>
  );
};

export default Forecast;
