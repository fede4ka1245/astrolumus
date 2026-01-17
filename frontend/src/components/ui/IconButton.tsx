import { Component, JSX } from 'solid-js';

interface IconButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  sx?: JSX.CSSProperties | ((theme: any) => JSX.CSSProperties);
  size?: 'small' | 'medium' | 'large';
  edge?: 'start' | 'end' | false;
}

const IconButton: Component<IconButtonProps> = (props) => {
  const computedStyle = (): JSX.CSSProperties => {
    const style: Record<string, any> = {
      cursor: 'pointer',
      border: 'none',
      background: 'transparent',
      padding: props.size === 'small' ? '5px' : props.size === 'large' ? '12px' : '8px',
      margin: 0,
      'font-family': 'inherit',
      display: 'inline-flex',
      'align-items': 'center',
      'justify-content': 'center',
      'border-radius': '50%',
      transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
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

  const { sx, size, edge, ...domProps } = props;

  return (
    <button
      style={computedStyle()}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.04)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
      {...domProps}
    >
      {props.children}
    </button>
  );
};

export default IconButton;
