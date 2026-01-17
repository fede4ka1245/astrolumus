import { Component, JSX } from 'solid-js';

interface TypographyProps extends JSX.HTMLAttributes<HTMLElement> {
  component?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  variant?: string;
  fontFamily?: string;
  fontWeight?: number | string;
  fontSize?: string | number;
  color?: string;
  textAlign?: string;
  lineHeight?: string | number;
  letterSpacing?: string | number;
}

const Typography: Component<TypographyProps> = (props) => {
  const computedStyle = (): JSX.CSSProperties => {
    const style: Record<string, any> = {};
    
    // Merge with existing style if it's an object
    if (typeof props.style === 'object' && props.style !== null && !Array.isArray(props.style)) {
      Object.assign(style, props.style);
    }

    if (props.fontFamily) {
      style['font-family'] = props.fontFamily;
    }
    if (props.fontWeight !== undefined) {
      style['font-weight'] = typeof props.fontWeight === 'number' ? props.fontWeight : props.fontWeight;
    }
    if (props.fontSize !== undefined) {
      style['font-size'] = typeof props.fontSize === 'number' ? `${props.fontSize}px` : props.fontSize;
    }
    if (props.color) {
      style.color = props.color;
    }
    if (props.textAlign) {
      style['text-align'] = props.textAlign;
    }
    if (props.lineHeight !== undefined) {
      style['line-height'] = typeof props.lineHeight === 'number' ? `${props.lineHeight}px` : props.lineHeight;
    }
    if (props.letterSpacing !== undefined) {
      style['letter-spacing'] = typeof props.letterSpacing === 'number' ? `${props.letterSpacing}px` : props.letterSpacing;
    }

    return style as JSX.CSSProperties;
  };

  const TagName = props.component || 'p';

  // Extract custom props to avoid passing them to DOM
  const {
    component,
    variant,
    fontFamily,
    fontWeight,
    fontSize,
    color,
    textAlign,
    lineHeight,
    letterSpacing,
    ref,
    ...domProps
  } = props;

  const propsWithStyle: any = {
    ...domProps,
    ref: ref as any,
    style: computedStyle(),
    children: props.children
  };

  // Use dynamic component rendering
  if (TagName === 'p') {
    return <p {...propsWithStyle} />;
  } else if (TagName === 'span') {
    return <span {...propsWithStyle} />;
  } else if (TagName === 'div') {
    return <div {...propsWithStyle} />;
  } else if (TagName === 'h1') {
    return <h1 {...propsWithStyle} />;
  } else if (TagName === 'h2') {
    return <h2 {...propsWithStyle} />;
  } else if (TagName === 'h3') {
    return <h3 {...propsWithStyle} />;
  } else if (TagName === 'h4') {
    return <h4 {...propsWithStyle} />;
  } else if (TagName === 'h5') {
    return <h5 {...propsWithStyle} />;
  } else if (TagName === 'h6') {
    return <h6 {...propsWithStyle} />;
  }
  
  return <p {...propsWithStyle} />;
};

export default Typography;
