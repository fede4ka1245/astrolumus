// Copy of IosSelector from DatePicker
interface SelectOption {
  value: any;
  text: string;
  disabled?: boolean;
}

interface IosSelectorOptions {
  el: HTMLElement;
  type?: 'infinite' | 'normal';
  count?: number;
  sensitivity?: number;
  source: SelectOption[];
  value?: any | null;
  onChange?: (selected: SelectOption) => void;
  styles: {
    selectWrap: string;
    selectOptions: string;
    selectOption: string;
    highlight: string;
    highlightList: string;
    highlightItem: string;
  };
  itemHeight?: number;
}

const easing = {
  easeOutCubic: (pos: number) => {
    return Math.pow(pos - 1, 3) + 1;
  },
  easeOutQuart: (pos: number) => {
    return -(Math.pow(pos - 1, 4) - 1);
  },
};

export class IosSelector {
  options: Omit<Required<IosSelectorOptions>, 'onChange'> & { onChange?: (selected: SelectOption) => void };
  type!: 'infinite' | 'normal';
  count!: number;
  sensitivity!: number;
  source!: SelectOption[];
  value!: any | null;
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
    this.a = this.options.sensitivity * 250;
    this.minV = Math.sqrt(1 / this.a);
    this.selected = this.source[0] || null;

    this.exceedA = 250;
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

    this.itemHeight = this.options.itemHeight !== undefined 
      ? this.options.itemHeight 
      : this.elems.el.offsetHeight * 3 / this.options.count;
    this.itemAngle = 360 / this.options.count;
    this.radius = this.itemHeight / Math.tan(this.itemAngle * Math.PI / 180);

    this._init();
  }

  _init() {
    this._create(this.options.source);

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

    const documentMouseUpHandler = (e: MouseEvent) => {
      if (this.isDragging) {
        this._touchend(e, this.touchData);
      }
    };

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
    if (e.type === 'mousemove' && !this.isDragging) {
      return;
    }

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

    this.wheelAccumulator += e.deltaY;

    if (this.wheelTimeout !== null) {
      clearTimeout(this.wheelTimeout);
    }

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

    this._stop();
    this.scroll = this._moveTo(newScroll);

    this.wheelTimeout = window.setTimeout(() => {
      let finalScroll = Math.round(this.scroll);
      
      // Skip disabled options
      if (this.source[finalScroll]?.disabled) {
        const direction = e.deltaY > 0 ? 1 : -1;
        finalScroll = this._findNextEnabledIndex(finalScroll, direction);
      }

      if (Math.abs(finalScroll - this.scroll) > 0.01) {
        this._animateToScroll(this.scroll, finalScroll, 0.15, 'easeOutQuart').then(() => {
          this._selectByScroll(finalScroll);
        });
      } else {
        this._selectByScroll(finalScroll);
      }

      this.wheelAccumulator = 0;
      this.wheelTimeout = null;
    }, 150);
  }

  _touchend(e: TouchEvent | MouseEvent, touchData: any) {
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
      const isDisabled = processedSource[i].disabled || false;
      const disabledClass = isDisabled ? ' disabled' : '';
      const disabledStyle = isDisabled ? 'opacity: 0.5; pointer-events: none;' : '';
      circleListHTML += `<li class="${this.styles.selectOption}${disabledClass}"
                      style="
                        top: ${this.itemHeight * -0.5}px;
                        height: ${this.itemHeight}px;
                        line-height: ${this.itemHeight}px;
                        transform: rotateX(${-this.itemAngle * i}deg) translate3d(0, 0, ${this.radius}px);
                        ${disabledStyle}
                      "
                      data-index="${i}"
                      data-disabled="${isDisabled}"
                    >${processedSource[i].text}</li>`;
    }

    let highListHTML = '';
    for (let i = 0; i < processedSource.length; i++) {
      const isDisabled = processedSource[i].disabled || false;
      const disabledClass = isDisabled ? ' disabled' : '';
      const disabledStyle = isDisabled ? 'opacity: 0.5;' : '';
      highListHTML += `<li class="${this.styles.highlightItem}${disabledClass}" style="height: ${this.itemHeight}px; ${disabledStyle}">
                        ${processedSource[i].text}
                      </li>`;
    }

    if (this.options.type === 'infinite') {
      for (let i = 0; i < this.quarterCount; i++) {
        const prevIndex = sourceLength - i - 1;
        const nextIndex = i;
        const prevIsDisabled = processedSource[prevIndex].disabled || false;
        const nextIsDisabled = processedSource[nextIndex].disabled || false;
        const prevDisabledClass = prevIsDisabled ? ' disabled' : '';
        const nextDisabledClass = nextIsDisabled ? ' disabled' : '';
        const prevDisabledStyle = prevIsDisabled ? 'opacity: 0.5; pointer-events: none;' : '';
        const nextDisabledStyle = nextIsDisabled ? 'opacity: 0.5; pointer-events: none;' : '';
        circleListHTML = `<li class="${this.styles.selectOption}${prevDisabledClass}"
                        style="
                          top: ${this.itemHeight * -0.5}px;
                          height: ${this.itemHeight}px;
                          line-height: ${this.itemHeight}px;
                          transform: rotateX(${this.itemAngle * (i + 1)}deg) translate3d(0, 0, ${this.radius}px);
                          ${prevDisabledStyle}
                        "
                        data-index="${-i - 1}"
                        data-disabled="${prevIsDisabled}"
                      >${processedSource[prevIndex].text}</li>` + circleListHTML;
        circleListHTML += `<li class="${this.styles.selectOption}${nextDisabledClass}"
                        style="
                          top: ${this.itemHeight * -0.5}px;
                          height: ${this.itemHeight}px;
                          line-height: ${this.itemHeight}px;
                          transform: rotateX(${-this.itemAngle * (i + sourceLength)}deg) translate3d(0, 0, ${this.radius}px);
                          ${nextDisabledStyle}
                        "
                        data-index="${i + sourceLength}"
                        data-disabled="${nextIsDisabled}"
                      >${processedSource[nextIndex].text}</li>`;
      }

      const lastIsDisabled = processedSource[sourceLength - 1].disabled || false;
      const firstIsDisabled = processedSource[0].disabled || false;
      const lastDisabledClass = lastIsDisabled ? ' disabled' : '';
      const firstDisabledClass = firstIsDisabled ? ' disabled' : '';
      const lastDisabledStyle = lastIsDisabled ? 'opacity: 0.5;' : '';
      const firstDisabledStyle = firstIsDisabled ? 'opacity: 0.5;' : '';
      highListHTML = `<li class="${this.styles.highlightItem}${lastDisabledClass}" style="height: ${this.itemHeight}px; ${lastDisabledStyle}">
                          ${processedSource[sourceLength - 1].text}
                        </li>` + highListHTML;
      highListHTML += `<li class="${this.styles.highlightItem}${firstDisabledClass}" style="height: ${this.itemHeight}px; ${firstDisabledStyle}">${processedSource[0].text}</li>`;
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

  _findNextEnabledIndex(startIndex: number, direction: number = 1): number {
    const len = this.source.length;
    let currentIndex = startIndex;
    let attempts = 0;
    
    while (attempts < len) {
      if (!this.source[currentIndex]?.disabled) {
        return currentIndex;
      }
      currentIndex = (currentIndex + direction + len) % len;
      attempts++;
    }
    
    // If all options are disabled, return startIndex
    return startIndex;
  }

  _selectByScroll(scroll: number) {
    scroll = this._normalizeScroll(scroll) | 0;
    if (scroll > this.source.length - 1) {
      scroll = this.source.length - 1;
      this._moveTo(scroll);
    }
    
    // Skip disabled options
    if (this.source[scroll]?.disabled) {
      const nextEnabled = this._findNextEnabledIndex(scroll, 1);
      scroll = nextEnabled;
    }
    
    this._moveTo(scroll);
    this.scroll = scroll;
    this.selected = this.source[scroll];
    this.value = this.selected.value;
    if (this.onChange && !this.selected.disabled) {
      this.onChange(this.selected);
    }
  }

  updateSource(source: SelectOption[]) {
    this._create(source);

    if (!this.moving) {
      this._selectByScroll(this.scroll);
    }
  }

  select(value: any, immediate: boolean = false) {
    for (let i = 0; i < this.source.length; i++) {
      if (this.source[i].value === value) {
        // Don't allow selection of disabled options
        if (this.source[i].disabled) {
          // Find next enabled option
          const nextEnabled = this._findNextEnabledIndex(i, 1);
          if (nextEnabled !== i) {
            value = this.source[nextEnabled].value;
            i = nextEnabled;
          } else {
            // All options are disabled, don't select
            return;
          }
        }
        
        cancelAnimationFrame(this.moveT);

        if (immediate) {
          this._selectByScroll(i);
          return;
        }

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
