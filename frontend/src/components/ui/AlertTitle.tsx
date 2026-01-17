import { Component, JSX } from 'solid-js';

interface AlertTitleProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element;
}

const AlertTitle: Component<AlertTitleProps> = (props) => {
  const computedStyle = (): JSX.CSSProperties => {
    const style: Record<string, any> = {
      'font-weight': 500,
      'margin-bottom': '4px',
      'font-size': '1rem',
    };
    
    // Merge with existing style if it's an object
    if (typeof props.style === 'object' && props.style !== null && !Array.isArray(props.style)) {
      Object.assign(style, props.style);
    }

    return style as JSX.CSSProperties;
  };

  return (
    <div style={computedStyle()} {...props}>
      {props.children}
    </div>
  );
};

export default AlertTitle;
