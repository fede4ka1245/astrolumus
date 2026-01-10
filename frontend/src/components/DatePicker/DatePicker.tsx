import { Component, onMount, onCleanup, createSignal, createEffect } from 'solid-js';
import styles from './DatePicker.module.css';

interface SelectOption {
  value: number;
  text: string;
    }

interface IosSelectorOptions {
  el: HTMLElement;
  type?: 'infinite' | 'normal';
  count?: number;
  sensitivity?: number;
  source: SelectOption[];
  value?: number | null;
  onChange?: (selected: SelectOption) => void;
  styles: {
    selectWrap: string;
    selectOptions: string;
    selectOption: string;
    highlight: string;
    highlightList: string;
    highlightItem: string;
  };
  }

const easing = {
  easeOutCubic: (pos: number) => {
    return Math.pow(pos - 1, 3) + 1;
    },
  easeOutQuart: (pos: number) => {
    return -(Math.pow(pos - 1, 4) - 1);
    },
  };
  
  class IosSelector {
  options: Omit<Required<IosSelectorOptions>, 'onChange'> & { onChange?: (selected: SelectOption) => void };
  type!: 'infinite' | 'normal';
  count!: number;
  sensitivity!: number;
  source!: SelectOption[];
  value!: number | null;
  onChange?: (selected: SelectOption) => void;
  styles: IosSelectorOptions['styles'];
  halfCount!: number;
  quarterCount!: number;
  a!: number;
  minV!: number;
  selected: SelectOption | null = null;
  exceedA: number = 10;
  moveT: number = 0;
  moving: boolean = false;
  elems: {
    el: HTMLElement;
    circleList: HTMLElement | null;
    circleItems: NodeListOf<HTMLElement> | null;
    highlight: HTMLElement | null;
    highlightList: HTMLElement | null;
    highlightitems: NodeListOf<HTMLElement> | null;
  };
  events: {
    touchstart: ((e: TouchEvent | MouseEvent) => void) | null;
    touchmove: ((e: TouchEvent | MouseEvent) => void) | null;
    touchend: ((e: TouchEvent | MouseEvent) => void) | null;
  };
  isDragging: boolean = false;
  itemHeight!: number;
  itemAngle!: number;
  radius!: number;
  scroll: number = 0;
  touchData: {
    startY: number;
    yArr: Array<[number, number]>;
    touchScroll?: number;
  } = {
    startY: 0,
    yArr: [],
  };
  wheelAccumulator: number = 0;
  wheelTimeout: number | null = null;

  constructor(options: IosSelectorOptions) {
    const defaults = {
      el: options.el,
      type: 'infinite' as const,
      count: 20,
      sensitivity: 0.8,
      source: options.source || [],
        value: null,
      onChange: options.onChange,
      styles: options.styles,
      };
  
    this.options = Object.assign({}, defaults, options) as typeof this.options;
    this.options.count = this.options.count - (this.options.count % 4);
    
    this.type = this.options.type;
    this.count = this.options.count;
    this.sensitivity = this.options.sensitivity;
    this.source = this.options.source;
    this.value = this.options.value;
    this.onChange = this.options.onChange;
    this.styles = this.options.styles;
  
      this.halfCount = this.options.count / 2;
      this.quarterCount = this.options.count / 4;
    this.a = this.options.sensitivity * 250; // Increased multiplier for faster deceleration
    this.minV = Math.sqrt(1 / this.a);
    this.selected = this.source[0] || null;
  
    this.exceedA = 250; // Increased for faster stopping at boundaries
    this.moveT = 0;
      this.moving = false;
  
      this.elems = {
      el: this.options.el,
        circleList: null,
      circleItems: null,
        highlight: null,
        highlightList: null,
      highlightitems: null,
      };

      this.events = {
        touchstart: null,
        touchmove: null,
      touchend: null,
      };
  
    this.itemHeight = this.elems.el.offsetHeight * 3 / this.options.count;
    this.itemAngle = 360 / this.options.count;
    this.radius = this.itemHeight / Math.tan(this.itemAngle * Math.PI / 180);

      this._init();
    }
  
    _init() {
      this._create(this.options.source);
  
    // Reset touchData
    this.touchData = {
        startY: 0,
      yArr: [],
      };
  
    for (const eventName in this.events) {
      this.events[eventName as keyof typeof this.events] = ((eventName: string) => {
        return (e: TouchEvent | MouseEvent) => {
          if (this.elems.el.contains(e.target as Node) || e.target === this.elems.el) {
              e.preventDefault();
              if (this.source.length) {
              (this as any)['_' + eventName](e, this.touchData);
              }
            }
          };
      })(eventName) as any;
      }
  
    // Separate handler for mouseup on document to handle mouse leaving element
    const documentMouseUpHandler = (e: MouseEvent) => {
      if (this.isDragging) {
        this._touchend(e, this.touchData);
      }
    };

    // Handler for wheel events (mouse scroll)
    const wheelHandler = (e: WheelEvent) => {
      if (this.elems.el.contains(e.target as Node) || e.target === this.elems.el) {
        e.preventDefault();
        if (this.source.length && !this.moving) {
          this._handleWheel(e);
        }
      }
    };

    this.elems.el.addEventListener('touchstart', this.events.touchstart!);
    this.elems.el.addEventListener('mousedown', this.events.touchstart!);
    this.elems.el.addEventListener('touchend', this.events.touchend!);
    document.addEventListener('mouseup', documentMouseUpHandler);
    this.elems.el.addEventListener('wheel', wheelHandler, { passive: false });
    
    // Store handlers for cleanup
    (this as any).documentMouseUpHandler = documentMouseUpHandler;
    (this as any).wheelHandler = wheelHandler;
      if (this.source.length) {
        this.value = this.value !== null ? this.value : this.source[0].value;
        this.select(this.value);
      }
    }
  
  _touchstart(e: TouchEvent | MouseEvent, touchData: any) {
    this.isDragging = true;
    this.elems.el.addEventListener('touchmove', this.events.touchmove!);
    document.addEventListener('mousemove', this.events.touchmove!);
    const eventY = (e as MouseEvent).clientY || (e as TouchEvent).touches[0].clientY;
      touchData.startY = eventY;
      touchData.yArr = [[eventY, new Date().getTime()]];
      touchData.touchScroll = this.scroll;
      this._stop();
    }
  
  _touchmove(e: TouchEvent | MouseEvent, touchData: any) {
    // For mouse events, check if we're still dragging
    if (e.type === 'mousemove' && !this.isDragging) {
      return;
    }
    
    // Allow movement even if mouse is outside element
    const eventY = (e as MouseEvent).clientY || (e as TouchEvent).touches[0].clientY;
    if (!touchData || !touchData.yArr) {
      return;
    }
      touchData.yArr.push([eventY, new Date().getTime()]);
    if (touchData.yArr.length > 5) {
      touchData.yArr.shift();
      }
  
    const scrollAdd = (touchData.startY - eventY) / this.itemHeight;
      let moveToScroll = scrollAdd + this.scroll;
  
      if (this.type === 'normal') {
        if (moveToScroll < 0) {
          moveToScroll *= 0.3;
        } else if (moveToScroll > this.source.length) {
          moveToScroll = this.source.length + (moveToScroll - this.source.length) * 0.3;
        }
      } else {
        moveToScroll = this._normalizeScroll(moveToScroll);
      }
  
      touchData.touchScroll = this._moveTo(moveToScroll);
    }
  
  _handleWheel(e: WheelEvent) {
    e.preventDefault();
    
    // Accumulate wheel delta
    this.wheelAccumulator += e.deltaY;
    
    // Clear existing timeout
    if (this.wheelTimeout !== null) {
      clearTimeout(this.wheelTimeout);
    }
    
    // Apply scroll change immediately based on current event (not accumulated)
    const scrollDelta = e.deltaY / this.itemHeight;
    let newScroll = this.scroll + scrollDelta;
    
    if (this.type === 'normal') {
      if (newScroll < 0) {
        newScroll = 0;
      } else if (newScroll > this.source.length - 1) {
        newScroll = this.source.length - 1;
      }
    } else {
      newScroll = this._normalizeScroll(newScroll);
    }
    
    // Stop any ongoing animation and move immediately
    this._stop();
    this.scroll = this._moveTo(newScroll);
    
    // Process final positioning after a delay (only when scrolling stops)
    this.wheelTimeout = window.setTimeout(() => {
      // Round current position to nearest item
      const finalScroll = Math.round(this.scroll);
      
      // Only animate if there's a difference
      if (Math.abs(finalScroll - this.scroll) > 0.01) {
        this._animateToScroll(this.scroll, finalScroll, 0.15, 'easeOutQuart').then(() => {
          this._selectByScroll(finalScroll);
        });
      } else {
        this._selectByScroll(finalScroll);
      }
      
      // Reset accumulator
      this.wheelAccumulator = 0;
      this.wheelTimeout = null;
    }, 150); // Delay to detect when scrolling stops
  }

  _touchend(e: TouchEvent | MouseEvent, touchData: any) {
    // Only handle if we were dragging
    if (!this.isDragging) {
      return;
    }

    this.isDragging = false;
    this.elems.el.removeEventListener('touchmove', this.events.touchmove!);
    document.removeEventListener('mousemove', this.events.touchmove!);
  
    if (!touchData || !touchData.yArr || touchData.yArr.length === 0) {
      return;
    }

    let v: number;
  
      if (touchData.yArr.length === 1) {
      v = 0;
    } else {
      const startTime = touchData.yArr[touchData.yArr.length - 2][1];
      const endTime = touchData.yArr[touchData.yArr.length - 1][1];
      const startY = touchData.yArr[touchData.yArr.length - 2][0];
      const endY = touchData.yArr[touchData.yArr.length - 1][0];

      if (endTime === startTime) {
        v = 0;
      } else {
        v = ((startY - endY) / this.itemHeight) * 1000 / (endTime - startTime);
        const sign = v > 0 ? 1 : -1;
        v = Math.abs(v) > 30 ? 30 * sign : v;
      }
      }
  
    this.scroll = touchData.touchScroll || this.scroll;
      this._animateMoveByInitV(v);
    }
  
  
  _create(source: SelectOption[]) {
      if (!source.length) {
        return;
      }
  
    let processedSource = source;
      if (this.options.type === 'infinite') {
      let concatSource = [...source];
        while (concatSource.length < this.halfCount) {
          concatSource = concatSource.concat(source);
        }
      processedSource = concatSource;
      }
    this.source = processedSource;
    const sourceLength = processedSource.length;
  
      let circleListHTML = '';
    for (let i = 0; i < processedSource.length; i++) {
      circleListHTML += `<li class="${this.styles.selectOption}"
                      style="
                        top: ${this.itemHeight * -0.5}px;
                        height: ${this.itemHeight}px;
                        line-height: ${this.itemHeight}px;
                        transform: rotateX(${-this.itemAngle * i}deg) translate3d(0, 0, ${this.radius}px);
                      "
                      data-index="${i}"
                    >${processedSource[i].text}</li>`;
      }
  
      let highListHTML = '';
    for (let i = 0; i < processedSource.length; i++) {
      highListHTML += `<li class="${this.styles.highlightItem}" style="height: ${this.itemHeight}px;">
                        ${processedSource[i].text}
                      </li>`;
      }
  
      if (this.options.type === 'infinite') {
        for (let i = 0; i < this.quarterCount; i++) {
        circleListHTML = `<li class="${this.styles.selectOption}"
                        style="
                          top: ${this.itemHeight * -0.5}px;
                          height: ${this.itemHeight}px;
                          line-height: ${this.itemHeight}px;
                          transform: rotateX(${this.itemAngle * (i + 1)}deg) translate3d(0, 0, ${this.radius}px);
                        "
                        data-index="${-i - 1}"
                      >${processedSource[sourceLength - i - 1].text}</li>` + circleListHTML;
        circleListHTML += `<li class="${this.styles.selectOption}"
                        style="
                          top: ${this.itemHeight * -0.5}px;
                          height: ${this.itemHeight}px;
                          line-height: ${this.itemHeight}px;
                          transform: rotateX(${-this.itemAngle * (i + sourceLength)}deg) translate3d(0, 0, ${this.radius}px);
                        "
                        data-index="${i + sourceLength}"
                      >${processedSource[i].text}</li>`;
        }
  
      highListHTML = `<li class="${this.styles.highlightItem}" style="height: ${this.itemHeight}px;">
                          ${processedSource[sourceLength - 1].text}
                        </li>` + highListHTML;
      highListHTML += `<li class="${this.styles.highlightItem}" style="height: ${this.itemHeight}px;">${processedSource[0].text}</li>`;
    }

    const template = `
      <div class="${this.styles.selectWrap}">
        <ul class="${this.styles.selectOptions}" style="transform: translate3d(0, 0, ${-this.radius}px) rotateX(0deg);">
          ${circleListHTML}
        </ul>
        <div class="${this.styles.highlight}">
          <ul class="${this.styles.highlightList}">
            ${highListHTML}
          </ul>
        </div>
      </div>
    `;

    this.elems.el.innerHTML = template;
    this.elems.circleList = this.elems.el.querySelector(`.${this.styles.selectOptions}`) as HTMLElement;
    this.elems.circleItems = this.elems.el.querySelectorAll(`.${this.styles.selectOption}`);
  
    this.elems.highlight = this.elems.el.querySelector(`.${this.styles.highlight}`) as HTMLElement;
    this.elems.highlightList = this.elems.el.querySelector(`.${this.styles.highlightList}`) as HTMLElement;
    this.elems.highlightitems = this.elems.el.querySelectorAll(`.${this.styles.highlightItem}`);
  
    if (this.type === 'infinite' && this.elems.highlightList) {
        this.elems.highlightList.style.top = -this.itemHeight + 'px';
      }
  
    if (this.elems.highlight) {
      this.elems.highlight.style.height = this.itemHeight + 'px';
      this.elems.highlight.style.lineHeight = this.itemHeight + 'px';
    }
    }
  
  _normalizeScroll(scroll: number): number {
      let normalizedScroll = scroll;
  
    while (normalizedScroll < 0) {
        normalizedScroll += this.source.length;
      }
      normalizedScroll = normalizedScroll % this.source.length;
      return normalizedScroll;
    }
  
  _moveTo(scroll: number): number {
      if (this.type === 'infinite') {
        scroll = this._normalizeScroll(scroll);
      }
    if (this.elems.circleList) {
      this.elems.circleList.style.transform = `translate3d(0, 0, ${-this.radius}px) rotateX(${this.itemAngle * scroll}deg)`;
    }
    if (this.elems.highlightList) {
      this.elems.highlightList.style.transform = `translate3d(0, ${-(scroll) * this.itemHeight}px, 0)`;
    }
  
    if (this.elems.circleItems) {
      [...this.elems.circleItems].forEach(itemElem => {
        const index = parseInt(itemElem.dataset.index || '0');
        if (Math.abs(index - scroll) > this.quarterCount) {
          itemElem.style.visibility = 'hidden';
        } else {
          itemElem.style.visibility = 'visible';
        }
      });
    }
  
      return scroll;
    }
  
  async _animateMoveByInitV(initV: number) {
    let initScroll: number;
    let finalScroll: number;
    let totalScrollLen: number;
    let a: number;
    let t: number;
  
      if (this.type === 'normal') {
        if (this.scroll < 0 || this.scroll > this.source.length - 1) {
          a = this.exceedA;
          initScroll = this.scroll;
          finalScroll = this.scroll < 0 ? 0 : this.source.length - 1;
          totalScrollLen = initScroll - finalScroll;
  
          t = Math.sqrt(Math.abs(totalScrollLen / a));
          initV = a * t;
          initV = this.scroll > 0 ? -initV : initV;
          await this._animateToScroll(initScroll, finalScroll, t);
        } else {
          initScroll = this.scroll;
        a = initV > 0 ? -this.a : this.a;
        t = Math.abs(initV / a);
        totalScrollLen = initV * t + a * t * t / 2;
        finalScroll = Math.round(this.scroll + totalScrollLen);
          finalScroll = finalScroll < 0 ? 0 : (finalScroll > this.source.length - 1 ? this.source.length - 1 : finalScroll);
  
          totalScrollLen = finalScroll - initScroll;
          t = Math.sqrt(Math.abs(totalScrollLen / a));
          await this._animateToScroll(this.scroll, finalScroll, t, 'easeOutQuart');
        }
      } else {
        initScroll = this.scroll;
  
      a = initV > 0 ? -this.a : this.a;
      t = Math.abs(initV / a);
      totalScrollLen = initV * t + a * t * t / 2;
      finalScroll = Math.round(this.scroll + totalScrollLen);
        await this._animateToScroll(this.scroll, finalScroll, t, 'easeOutQuart');
      }
      
      this._selectByScroll(this.scroll);
    }
  
  _animateToScroll(initScroll: number, finalScroll: number, t: number, easingName: keyof typeof easing = 'easeOutQuart'): Promise<void> {
      if (initScroll === finalScroll || t === 0) {
        this._moveTo(initScroll);
      return Promise.resolve();
      }
  
    const start = new Date().getTime() / 1000;
      let pass = 0;
    const totalScrollLen = finalScroll - initScroll;
      
    return new Promise((resolve) => {
        this.moving = true;
      const tick = () => {
          pass = new Date().getTime() / 1000 - start;
  
          if (pass < t) {
            this.scroll = this._moveTo(initScroll + easing[easingName](pass / t) * totalScrollLen);
            this.moveT = requestAnimationFrame(tick);
          } else {
            resolve();
            this._stop();
            this.scroll = this._moveTo(initScroll + totalScrollLen);
          }
        };
        tick();
      });
    }
  
    _stop() {
      this.moving = false;
      cancelAnimationFrame(this.moveT);
    }
  
  _selectByScroll(scroll: number) {
      scroll = this._normalizeScroll(scroll) | 0;
      if (scroll > this.source.length - 1) {
        scroll = this.source.length - 1;
        this._moveTo(scroll);
      }
      this._moveTo(scroll);
      this.scroll = scroll;
      this.selected = this.source[scroll];
      this.value = this.selected.value;
    if (this.onChange) {
      this.onChange(this.selected);
    }
    }
  
  updateSource(source: SelectOption[]) {
      this._create(source);
  
      if (!this.moving) {
        this._selectByScroll(this.scroll);
      }
    }
  
  select(value: number, immediate: boolean = false) {
      for (let i = 0; i < this.source.length; i++) {
        if (this.source[i].value === value) {
          cancelAnimationFrame(this.moveT);
          
          if (immediate) {
            // Set immediately without animation
            this._selectByScroll(i);
            return;
          }
          
          // Animate to value
          const initScroll = this._normalizeScroll(this.scroll);
          const finalScroll = i;
          const t = Math.sqrt(Math.abs((finalScroll - initScroll) / this.a));
          this._animateToScroll(initScroll, finalScroll, t);
          setTimeout(() => this._selectByScroll(i), 100);
          return;
        }
      }
      throw new Error(`can not select value: ${value}, ${value} match nothing in current source`);
    }
  
    destroy() {
      this._stop();
    if (this.wheelTimeout !== null) {
      clearTimeout(this.wheelTimeout);
      this.wheelTimeout = null;
    }
    if (this.events.touchstart) {
      this.elems.el.removeEventListener('touchstart', this.events.touchstart);
      this.elems.el.removeEventListener('mousedown', this.events.touchstart);
    }
    if (this.events.touchmove) {
      this.elems.el.removeEventListener('touchmove', this.events.touchmove);
      document.removeEventListener('mousemove', this.events.touchmove);
    }
    if (this.events.touchend) {
      this.elems.el.removeEventListener('touchend', this.events.touchend);
    }
    if ((this as any).documentMouseUpHandler) {
      document.removeEventListener('mouseup', (this as any).documentMouseUpHandler);
    }
    if ((this as any).wheelHandler) {
      this.elems.el.removeEventListener('wheel', (this as any).wheelHandler);
    }
    this.elems.el.innerHTML = '';
  }
}

function getYears(): SelectOption[] {
  const years: SelectOption[] = [];

  // Generate years from 1000 to 3000 (optimized range)
  for (let i = 1000; i <= 3000; i++) {
    years.push({
      value: i,
      text: i.toString()
    });
  }
  return years;
}
  
function getMonths(): SelectOption[] {
  const months: SelectOption[] = [];
      for (let i = 1; i <= 12; i++) {
          months.push({
              value: i,
      text: i.toString()
          });
      }
      return months;
  }
  
function getDays(year: number, month: number): SelectOption[] {
  const dayCount = new Date(year, month, 0).getDate();
  const days: SelectOption[] = [];
  
      for (let i = 1; i <= dayCount; i++) {
          days.push({
              value: i,
      text: i.toString()
          });
      }
  
      return days; 
  }
  
function getHours(): SelectOption[] {
  const hours: SelectOption[] = [];
  for (let i = 0; i < 24; i++) {
    hours.push({
      value: i,
      text: i.toString().padStart(2, '0')
    });
  }
  return hours;
}

function getMinutes(): SelectOption[] {
  const minutes: SelectOption[] = [];
  for (let i = 0; i < 60; i++) {
    minutes.push({
      value: i,
      text: i.toString().padStart(2, '0')
    });
  }
  return minutes;
}

function getSeconds(): SelectOption[] {
  const seconds: SelectOption[] = [];
  for (let i = 0; i < 60; i++) {
    seconds.push({
      value: i,
      text: i.toString().padStart(2, '0')
    });
  }
  return seconds;
}

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
}

export interface DatePickerRef {
  setDate: (date: Date) => void;
}

const DatePicker: Component<DatePickerProps & { ref?: (ref: DatePickerRef | null) => void }> = (props) => {
  let dayRef: HTMLDivElement | undefined;
  let monthRef: HTMLDivElement | undefined;
  let yearRef: HTMLDivElement | undefined;
  let hourRef: HTMLDivElement | undefined;
  let minuteRef: HTMLDivElement | undefined;
  let secondRef: HTMLDivElement | undefined;

  let daySelector: IosSelector | null = null;
  let monthSelector: IosSelector | null = null;
  let yearSelector: IosSelector | null = null;
  let hourSelector: IosSelector | null = null;
  let minuteSelector: IosSelector | null = null;
  let secondSelector: IosSelector | null = null;

  const [currentYear, setCurrentYear] = createSignal(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = createSignal(1);
  const [currentDay, setCurrentDay] = createSignal(1);
  const [currentHour, setCurrentHour] = createSignal(0);
  const [currentMinute, setCurrentMinute] = createSignal(0);
  const [currentSecond, setCurrentSecond] = createSignal(0);

  onMount(() => {
    if (!dayRef || !monthRef || !yearRef || !hourRef || !minuteRef || !secondRef) return;

    const yearSource = getYears();
    const monthSource = getMonths();
    const daySource = getDays(currentYear(), currentMonth());
    const hourSource = getHours();
    const minuteSource = getMinutes();
    const secondSource = getSeconds();

    const selectorStyles = {
      selectWrap: styles.selectWrap,
      selectOptions: styles.selectOptions,
      selectOption: styles.selectOption,
      highlight: styles.highlight,
      highlightList: styles.highlightList,
      highlightItem: styles.highlightItem,
    };

    daySelector = new IosSelector({
      el: dayRef,
      type: 'infinite',
      source: daySource,
      count: 20,
      sensitivity: 0.1,
      styles: selectorStyles,
      onChange: (selected) => {
        setCurrentDay(selected.value);
        const newDate = new Date(
          currentYear(),
          currentMonth() - 1,
          selected.value,
          currentHour(),
          currentMinute(),
          currentSecond()
        );
        props.onChange?.(newDate);
      }
  });
  
  monthSelector = new IosSelector({
      el: monthRef,
      type: 'infinite',
      source: monthSource,
      count: 20,
      sensitivity: 0.1,
      styles: selectorStyles,
      onChange: (selected) => {
        setCurrentMonth(selected.value);
        const newDaySource = getDays(currentYear(), selected.value);
        daySelector?.updateSource(newDaySource);
        const newDate = new Date(
          currentYear(),
          selected.value - 1,
          daySelector?.value || currentDay(),
          currentHour(),
          currentMinute(),
          currentSecond()
        );
        props.onChange?.(newDate);
      }
  });
  
    yearSelector = new IosSelector({
      el: yearRef,
      type: 'infinite',
      source: yearSource,
      count: 20,
      sensitivity: 0.1,
      styles: selectorStyles,
      onChange: (selected) => {
        setCurrentYear(selected.value);
        const newDaySource = getDays(selected.value, currentMonth());
        daySelector?.updateSource(newDaySource);
        const newDate = new Date(
          selected.value,
          currentMonth() - 1,
          daySelector?.value || currentDay(),
          currentHour(),
          currentMinute(),
          currentSecond()
        );
        props.onChange?.(newDate);
      }
    });

    hourSelector = new IosSelector({
      el: hourRef,
      type: 'normal',
      source: hourSource,
      count: 20,
      sensitivity: 0.1,
      styles: selectorStyles,
      onChange: (selected) => {
        setCurrentHour(selected.value);
        const newDate = new Date(
          currentYear(),
          currentMonth() - 1,
          currentDay(),
          selected.value,
          currentMinute(),
          currentSecond()
        );
        props.onChange?.(newDate);
      }
    });

    minuteSelector = new IosSelector({
      el: minuteRef,
      type: 'normal',
      source: minuteSource,
      count: 20,
      sensitivity: 0.1,
      styles: selectorStyles,
      onChange: (selected) => {
        setCurrentMinute(selected.value);
        const newDate = new Date(
          currentYear(),
          currentMonth() - 1,
          currentDay(),
          currentHour(),
          selected.value,
          currentSecond()
        );
        props.onChange?.(newDate);
      }
    });

    secondSelector = new IosSelector({
      el: secondRef,
      type: 'normal',
      source: secondSource,
      count: 20,
      sensitivity: 0.1,
      styles: selectorStyles,
      onChange: (selected) => {
        setCurrentSecond(selected.value);
        const newDate = new Date(
          currentYear(),
          currentMonth() - 1,
          currentDay(),
          currentHour(),
          currentMinute(),
          selected.value
        );
        props.onChange?.(newDate);
      }
    });

    const now = props.value || new Date();
    setTimeout(() => {
      // Set date instantly on first render
      daySelector?.select(now.getDate(), true);
      monthSelector?.select(now.getMonth() + 1, true);
      yearSelector?.select(now.getFullYear(), true);
      hourSelector?.select(now.getHours(), true);
      minuteSelector?.select(now.getMinutes(), true);
      secondSelector?.select(now.getSeconds(), true);
      
      // Expose ref methods after selectors are initialized
      if (props.ref) {
        props.ref({
          setDate: (date: Date) => {
            if (daySelector && monthSelector && yearSelector && hourSelector && minuteSelector && secondSelector) {
              // Set immediately without animation when called from input
              daySelector.select(date.getDate(), true);
              monthSelector.select(date.getMonth() + 1, true);
              yearSelector.select(date.getFullYear(), true);
              hourSelector.select(date.getHours(), true);
              minuteSelector.select(date.getMinutes(), true);
              secondSelector.select(date.getSeconds(), true);
            }
          }
        });
      }
    }, 100);
  });

  onCleanup(() => {
    daySelector?.destroy();
    monthSelector?.destroy();
    yearSelector?.destroy();
    hourSelector?.destroy();
    minuteSelector?.destroy();
    secondSelector?.destroy();
  });

  return (
    <div class={styles.pickerContainer}>
      <div class={styles.dateSelector}>
        <div ref={dayRef}></div>
        <div ref={monthRef}></div>
        <div ref={yearRef}></div>
      </div>
      <div class={styles.hourSelector}>
        <div ref={hourRef}></div>
        <div ref={minuteRef}></div>
        <div ref={secondRef}></div>
      </div>
    </div>
  );
};

export default DatePicker;
