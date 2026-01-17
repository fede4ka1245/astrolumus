export enum ButtonType {
  // eslint-disable-next-line no-unused-vars
  gradient = '1',
  // eslint-disable-next-line no-unused-vars
  outline = '0'
}

export type ButtonProps = {
  onClick?: Function,
  text?: string,
  type?: ButtonType,
  isDisabled?: boolean,
  height?: string,
  width?: string
};
