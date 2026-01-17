import { Component, JSX } from 'solid-js';

interface AspectRatioProps extends JSX.HTMLAttributes<HTMLDivElement> {
  ratio?: number | string;
  children: JSX.Element;
}

const AspectRatio: Component<AspectRatioProps> = (props) => {
  const computedStyle = (): JSX.CSSProperties => {
    const ratio = typeof props.ratio === 'string' ? parseFloat(props.ratio) : (props.ratio || 1);
    const paddingBottom = `${(1 / ratio) * 100}%`;
    
    const style: Record<string, any> = {
      position: 'relative',
      width: '100%',
      'padding-bottom': paddingBottom,
    };
    
    // Merge with existing style if it's an object
    if (typeof props.style === 'object' && props.style !== null && !Array.isArray(props.style)) {
      Object.assign(style, props.style);
    }

    return style as JSX.CSSProperties;
  };

  const { ratio, ...domProps } = props;

  return (
    <div style={computedStyle()} {...domProps}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        {props.children}
      </div>
    </div>
  );
};

export default AspectRatio;
