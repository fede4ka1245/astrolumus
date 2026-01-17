import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

export const DeepSkyToolTip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    display: 'none'
  },
  [`& .${tooltipClasses.tooltip}`]: {
    zIndex: 30,
    color: 'black',
    fontFamily: 'Gilroy',
    borderRadius: '30px',
    background: 'transparent',
    wordWrap: 'normal',
    width: '260px',
    pointerEvents: 'none',
    wordBreak: 'keep-all'
  }
}));
