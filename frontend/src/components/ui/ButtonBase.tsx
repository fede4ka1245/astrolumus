import { Component, JSX } from 'solid-js';

interface ButtonBaseProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  sx?: JSX.CSSProperties | ((theme: any) => JSX.CSSProperties);
  component?: keyof JSX.IntrinsicElements;
}

const ButtonBase: Component<ButtonBaseProps> = (props) => {
  const computedStyle = (): JSX.CSSProperties => {
    const style: Record<string, any> = {
      cursor: 'pointer',
      border: 'none',
      background: 'transparent',
      padding: 0,
      margin: 0,
      'font-family': 'inherit',
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

  const Component = (props.component || 'button') as keyof JSX.IntrinsicElements;
  const { component, sx, ...domProps } = props;

  return (
    <Component style={computedStyle()} {...domProps}>
      {props.children}
    </Component>
  );
};

export default ButtonBase;
