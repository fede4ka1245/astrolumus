import { Component, JSX } from 'solid-js';

interface AlertProps extends JSX.HTMLAttributes<HTMLDivElement> {
  severity?: 'error' | 'warning' | 'info' | 'success';
  variant?: 'filled' | 'outlined' | 'standard';
  children: JSX.Element;
  sx?: JSX.CSSProperties | ((theme: any) => JSX.CSSProperties);
}

const Alert: Component<AlertProps> = (props) => {
  const getSeverityColors = () => {
    switch (props.severity) {
      case 'error':
        return { bg: '#f44336', color: '#fff', border: '#d32f2f' };
      case 'warning':
        return { bg: '#ff9800', color: '#fff', border: '#f57c00' };
      case 'success':
        return { bg: '#4caf50', color: '#fff', border: '#388e3c' };
      default:
        return { bg: '#2196f3', color: '#fff', border: '#1976d2' };
    }
  };

  const computedStyle = (): JSX.CSSProperties => {
    const colors = getSeverityColors();
    const style: Record<string, any> = {
      padding: '16px',
      'border-radius': '4px',
      display: 'flex',
      'align-items': 'flex-start',
      'font-size': '0.875rem',
      'font-family': 'inherit',
    };

    if (props.variant === 'outlined') {
      style['background-color'] = 'transparent';
      style.color = colors.bg;
      style.border = `1px solid ${colors.border}`;
    } else if (props.variant === 'filled') {
      style['background-color'] = colors.bg;
      style.color = colors.color;
    } else {
      style['background-color'] = `${colors.bg}20`;
      style.color = colors.bg;
    }
    
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

  const { severity, variant, sx, ...domProps } = props;

  return (
    <div style={computedStyle()} {...domProps}>
      {props.children}
    </div>
  );
};

export default Alert;
