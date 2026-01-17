import { Component, JSX } from 'solid-js';

interface SkeletonProps extends JSX.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave' | false;
}

const Skeleton: Component<SkeletonProps> = (props) => {
  const computedStyle = (): JSX.CSSProperties => {
    const style: Record<string, any> = {
      display: 'inline-block',
      'background-color': 'rgba(0, 0, 0, 0.11)',
      'border-radius': props.variant === 'circular' ? '50%' : props.variant === 'rectangular' ? '0' : '4px',
      width: props.width || (props.variant === 'text' ? '100%' : undefined),
      height: props.height || (props.variant === 'text' ? '1em' : undefined),
    };

    if (props.animation === 'pulse' || props.animation === undefined) {
      style.animation = 'skeleton-pulse 1.5s ease-in-out 0.5s infinite';
    } else if (props.animation === 'wave') {
      style.animation = 'skeleton-wave 1.6s linear 0.5s infinite';
      style['background-size'] = '200% 100%';
      style['background-image'] = 'linear-gradient(90deg, rgba(0, 0, 0, 0.11) 0%, rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 0.11) 100%)';
    }
    
    // Merge with existing style if it's an object
    if (typeof props.style === 'object' && props.style !== null && !Array.isArray(props.style)) {
      Object.assign(style, props.style);
    }

    return style as JSX.CSSProperties;
  };

  const { variant, width, height, animation, ...domProps } = props;

  return (
    <>
      <style>
        {`
          @keyframes skeleton-pulse {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }
          @keyframes skeleton-wave {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>
      <div style={computedStyle()} {...domProps}>
        {props.children}
      </div>
    </>
  );
};

export default Skeleton;
