import { Option } from '../../../../models/types/Option';

export type OptionsProps = {
  isOpen: boolean,
  setTargetOption?: Function,
  close: Function,
  options?: Array<Option>,
  isDark?: boolean
}
