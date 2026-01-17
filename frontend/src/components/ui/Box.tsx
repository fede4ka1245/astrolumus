import { Component, JSX } from 'solid-js';

interface BoxProps extends JSX.HTMLAttributes<HTMLDivElement> {
  component?: keyof JSX.IntrinsicElements;
  sx?: JSX.CSSProperties | ((theme: any) => JSX.CSSProperties);
}

const Box: Component<BoxProps> = (props) => {
  const computedStyle = (): JSX.CSSProperties => {
    const style: Record<string, any> = {};
    
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

  const Component = (props.component || 'div') as keyof JSX.IntrinsicElements;
  const { component, sx, ...domProps } = props;

  return (
    <Component style={computedStyle()} {...domProps}>
      {props.children}
    </Component>
  );
};

export default Box;
