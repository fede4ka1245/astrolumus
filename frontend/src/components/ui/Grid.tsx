import { Component, JSX } from 'solid-js';

interface GridProps extends JSX.HTMLAttributes<HTMLDivElement> {
  container?: boolean;
  item?: boolean;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: string;
  alignItems?: string;
  pl?: number | string;
  pr?: number | string;
  pt?: number | string;
  pb?: number | string;
  px?: number | string;
  py?: number | string;
  width?: string | number;
  height?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  position?: string;
  zIndex?: number | string;
  display?: string;
  gap?: number | string;
  spacing?: number;
  borderRadius?: string | number;
  overflow?: string;
  sx?: JSX.CSSProperties | ((theme: any) => JSX.CSSProperties);
  className?: string;
  class?: string;
  left?: string | number;
  right?: string | number;
  top?: string | number;
  bottom?: string | number;
  textAlign?: string;
  ml?: string | number;
  mr?: string | number;
  mt?: string | number;
  mb?: string | number;
}

const Grid: Component<GridProps> = (props) => {
  const computedStyle = (): JSX.CSSProperties => {
    const style: Record<string, any> = {};
    
    // Merge with existing style if it's an object
    if (typeof props.style === 'object' && props.style !== null && !Array.isArray(props.style)) {
      Object.assign(style, props.style);
    }

    // Container styles
    if (props.container) {
      style.display = props.display || 'flex';
      if (props.direction) {
        style['flex-direction'] = props.direction;
      }
      if (props.justifyContent) {
        style['justify-content'] = props.justifyContent;
      }
      if (props.alignItems) {
        style['align-items'] = props.alignItems;
      }
      if (props.gap !== undefined) {
        style.gap = typeof props.gap === 'number' ? `${props.gap}px` : props.gap;
      }
      if (props.spacing !== undefined) {
        style.gap = `${props.spacing * 8}px`; // MUI default spacing unit
      }
    } else if (props.item) {
      // Item styles - only set display if explicitly provided
      if (props.display) {
        style.display = props.display;
      }
    } else if (props.display) {
      // If neither container nor item, but display is provided
      style.display = props.display;
    }

    // Padding
    if (props.pl !== undefined) {
      style['padding-left'] = typeof props.pl === 'number' ? `${props.pl * 8}px` : props.pl;
    }
    if (props.pr !== undefined) {
      style['padding-right'] = typeof props.pr === 'number' ? `${props.pr * 8}px` : props.pr;
    }
    if (props.pt !== undefined) {
      style['padding-top'] = typeof props.pt === 'number' ? `${props.pt * 8}px` : props.pt;
    }
    if (props.pb !== undefined) {
      style['padding-bottom'] = typeof props.pb === 'number' ? `${props.pb * 8}px` : props.pb;
    }
    if (props.px !== undefined) {
      const pxValue = typeof props.px === 'number' ? `${props.px * 8}px` : props.px;
      style['padding-left'] = pxValue;
      style['padding-right'] = pxValue;
    }
    if (props.py !== undefined) {
      const pyValue = typeof props.py === 'number' ? `${props.py * 8}px` : props.py;
      style['padding-top'] = pyValue;
      style['padding-bottom'] = pyValue;
    }

    // Dimensions
    if (props.width !== undefined) {
      style.width = typeof props.width === 'number' ? `${props.width}px` : props.width;
    }
    if (props.height !== undefined) {
      style.height = typeof props.height === 'number' ? `${props.height}px` : props.height;
    }
    if (props.minHeight !== undefined) {
      style['min-height'] = typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight;
    }
    if (props.maxWidth !== undefined) {
      style['max-width'] = typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth;
    }
    if (props.maxHeight !== undefined) {
      style['max-height'] = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight;
    }

    // Other styles
    if (props.position) {
      style.position = props.position;
    }
    if (props.zIndex !== undefined) {
      style['z-index'] = typeof props.zIndex === 'number' ? props.zIndex : props.zIndex;
    }
    if (props.borderRadius !== undefined) {
      style['border-radius'] = typeof props.borderRadius === 'number' ? `${props.borderRadius}px` : props.borderRadius;
    }
    if (props.overflow) {
      style.overflow = props.overflow;
    }
    if (props.left !== undefined) {
      style.left = typeof props.left === 'number' ? `${props.left}px` : props.left;
    }
    if (props.right !== undefined) {
      style.right = typeof props.right === 'number' ? `${props.right}px` : props.right;
    }
    if (props.top !== undefined) {
      style.top = typeof props.top === 'number' ? `${props.top}px` : props.top;
    }
    if (props.bottom !== undefined) {
      style.bottom = typeof props.bottom === 'number' ? `${props.bottom}px` : props.bottom;
    }
    if (props.textAlign) {
      style['text-align'] = props.textAlign;
    }
    if (props.ml !== undefined) {
      style['margin-left'] = typeof props.ml === 'number' ? `${props.ml}px` : props.ml;
    }
    if (props.mr !== undefined) {
      style['margin-right'] = typeof props.mr === 'number' ? `${props.mr}px` : props.mr;
    }
    if (props.mt !== undefined) {
      style['margin-top'] = typeof props.mt === 'number' ? `${props.mt}px` : props.mt;
    }
    if (props.mb !== undefined) {
      style['margin-bottom'] = typeof props.mb === 'number' ? `${props.mb}px` : props.mb;
    }

    // Handle sx prop
    if (props.sx) {
      const sxStyle = typeof props.sx === 'function' ? props.sx({}) : props.sx;
      Object.assign(style, sxStyle);
    }

    return style as JSX.CSSProperties;
  };

  // Extract custom props to avoid passing them to DOM
  const {
    container,
    item,
    direction,
    justifyContent,
    alignItems,
    pl,
    pr,
    pt,
    pb,
    px,
    py,
    width,
    height,
    minHeight,
    maxWidth,
    maxHeight,
    position,
    zIndex,
    display,
    gap,
    spacing,
    borderRadius,
    overflow,
    sx,
    className,
    class: classProp,
    left,
    right,
    top,
    bottom,
    textAlign,
    ml,
    mr,
    mt,
    mb,
    ...domProps
  } = props;

  const classNames = className || classProp;

  return (
    <div ref={props.ref} style={computedStyle()} class={classNames} {...domProps}>
      {props.children}
    </div>
  );
};

export default Grid;
