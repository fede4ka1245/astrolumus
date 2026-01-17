import React from 'react';

export interface PlanetModalProps {
  isOpen: boolean,
  close: (...props: any) => any,
  children: React.ReactNode [] | React.ReactNode;
  isCollapse: boolean
}
