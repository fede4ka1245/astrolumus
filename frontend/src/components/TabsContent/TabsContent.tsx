import { Accessor, Component, createEffect, createSignal, JSX, onCleanup, onMount } from 'solid-js';
import { render } from 'solid-js/web';
import styles from './TabsContent.module.css';

// Helper для double requestAnimationFrame
const doubleRaf = (): Promise<void> => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
};

// Helper для задержки
const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export interface TabsContentProps {
  tabs: Record<string, () => JSX.Element>;
  currentTab: Accessor<string>;
  tabsOrder: string[];
  onContainer?: (el: HTMLDivElement) => void;
}

const TabsContent: Component<TabsContentProps> = (props) => {
  const [container, setContainer] = createSignal<HTMLDivElement>();
  let prevElement: HTMLDivElement | undefined;
  let prevTab = props.currentTab();
  let prevDispose: (() => void) | undefined;
  let isInitialRender = true;

  createEffect(async () => {
    const currentTabValue = props.currentTab();
    if (!container()) return;
    
    // Если таб не изменился, ничего не делаем
    if (prevTab === currentTabValue) return;
    
    // Пропускаем анимацию только для самого первого рендера (когда prevElement еще не создан)
    if (isInitialRender) {
      if (!prevElement) {
        isInitialRender = false;
        prevTab = currentTabValue;
        return;
      }
      isInitialRender = false;
    }

    const toRight = props.tabsOrder.indexOf(currentTabValue) > props.tabsOrder.indexOf(prevTab);
    const oldPrevTab = prevTab;
    prevTab = currentTabValue;

    const newElement = document.createElement('div');
    newElement.className = styles.tabContentItem;
    
    const scrollableContent = document.createElement('div');
    scrollableContent.className = styles.scrollableContent;
    newElement.appendChild(scrollableContent);

    // Рендерим контент таба используя SolidJS render
    const tabContent = props.tabs[currentTabValue]();
    const newDispose = render(() => tabContent, scrollableContent);

    if (prevElement) {
      prevElement.classList.add(styles.tabContentExit);
    }

    if (toRight) {
      newElement.classList.add(styles.tabContentGoRight);
      container()!.appendChild(newElement);
      await doubleRaf();
      if (prevElement) {
        prevElement.classList.add(styles.tabContentGoLeft);
      }
      newElement.classList.remove(styles.tabContentGoRight);
    } else {
      newElement.classList.add(styles.tabContentGoLeft);
      container()!.appendChild(newElement);
      await doubleRaf();
      if (prevElement) {
        prevElement.classList.add(styles.tabContentGoRight);
      }
      newElement.classList.remove(styles.tabContentGoLeft);
    }

    await delay(200);
    if (prevElement) {
      prevElement.remove();
    }
    if (prevDispose) {
      prevDispose();
    }

    prevElement = newElement;
    prevDispose = newDispose;
  });

  const initialTab = props.tabs[props.currentTab()]();

  // Рендерим начальный таб сразу когда контейнер готов
  createEffect(() => {
    if (container() && prevElement) {
      const scrollableContent = prevElement.querySelector(`.${styles.scrollableContent}`) as HTMLDivElement;
      if (scrollableContent && !prevDispose) {
        prevDispose = render(() => initialTab, scrollableContent);
      }
    }
  });

  onCleanup(() => {
    if (prevDispose) {
      prevDispose();
    }
  });

  return (
    <div
      ref={(el) => {
        setContainer(el);
        if (props.onContainer && el) {
          props.onContainer(el);
        }
      }}
      class={styles.tabContent}
    >
      <div 
        ref={(el) => {
          if (el) {
            prevElement = el;
          }
        }} 
        class={styles.tabContentItem}
      >
        <div class={styles.scrollableContent}></div>
      </div>
    </div>
  );
};

export default TabsContent;
