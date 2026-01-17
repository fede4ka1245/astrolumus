import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

export default styled(Switch)(() => ({
  '& .MuiSwitch-switchBase': {
    '&.Mui-checked': {
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#37366B'
      }
    }
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#C1FFFF'
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2
  }
}));
