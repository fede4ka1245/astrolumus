import { Component, JSX } from 'solid-js';

interface CardActionAreaProps extends JSX.HTMLAttributes<HTMLDivElement> {
  sx?: JSX.CSSProperties | ((theme: any) => JSX.CSSProperties);
}

const CardActionArea: Component<CardActionAreaProps> = (props) => {
  const computedStyle = (): JSX.CSSProperties => {
    const style: Record<string, any> = {
      cursor: 'pointer',
      userSelect: 'none',
    };
    
    // Merge with existing style if it's an object
    if (typeof props.style === 'object' && props.style !== null && !Array.isArray(props.style)) {
      Object.assign(style, props.style);
    }

    // Handle sx prop
    if (props.sx) {
      const sxStyle = typeof props.sx === 'function' ? props.sx({}) : props.sx;
      Object.assign(style, sxStyle);
    }

    return style as JSX.CSSProperties;
  };

  const { sx, ...domProps } = props;

  return (
    <div style={computedStyle()} {...domProps}>
      {props.children}
    </div>
  );
};

export default CardActionArea;
