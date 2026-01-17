import React from 'react';

export interface ModalProps {
  isOpen: boolean
  close: (props?: any) => any
  height?: string
  children?: React.ReactNode
  maxHeight?: string
  isDark?: boolean
  background?: string
  isSwipeable?: boolean
  onScroll?:() => void
}
