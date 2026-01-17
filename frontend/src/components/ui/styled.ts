import { Component, JSX } from 'solid-js';

type StyledComponent<T> = Component<T & { sx?: JSX.CSSProperties | ((theme: any) => JSX.CSSProperties) }>;

export function styled<T extends keyof JSX.IntrinsicElements>(
  component: T
): (styles: JSX.CSSProperties | ((theme: any) => JSX.CSSProperties)) => StyledComponent<JSX.IntrinsicElements[T]> {
  return (styles: JSX.CSSProperties | ((theme: any) => JSX.CSSProperties)) => {
    return (props: any) => {
      const computedStyle = (): JSX.CSSProperties => {
        const style: Record<string, any> = {};
        
        const baseStyles = typeof styles === 'function' ? styles({}) : styles;
        Object.assign(style, baseStyles);
        
        if (typeof props.style === 'object' && props.style !== null && !Array.isArray(props.style)) {
          Object.assign(style, props.style);
        }

        if (props.sx) {
          const sxStyle = typeof props.sx === 'function' ? props.sx({}) : props.sx;
          Object.assign(style, sxStyle);
        }

        return style as JSX.CSSProperties;
      };

      const Component = component as keyof JSX.IntrinsicElements;
      const { sx, ...domProps } = props;

      return (
        <Component style={computedStyle()} {...domProps}>
          {props.children}
        </Component>
      );
    };
  };
}
