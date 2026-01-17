import { Component, JSX } from 'solid-js';

interface ArrowDropDownProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
  sx?: JSX.CSSProperties | ((theme: any) => JSX.CSSProperties);
}

const ArrowDropDown: Component<ArrowDropDownProps> = (props) => {
  const computedStyle = (): JSX.CSSProperties => {
    const style: Record<string, any> = {
      width: '1em',
      height: '1em',
      display: 'inline-block',
      'user-select': 'none',
      'flex-shrink': 0,
      'font-size': '1.5rem',
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

  const { sx, ...svgProps } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      fill="currentColor"
      style={computedStyle()}
      {...svgProps}
    >
      <path d="M7 10l5 5 5-5z" />
    </svg>
  );
};

export default ArrowDropDown;
