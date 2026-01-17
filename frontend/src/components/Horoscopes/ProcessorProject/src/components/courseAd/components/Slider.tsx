import { styled } from '@mui/material';
import Slider from '@mui/material/Slider';

export default styled(Slider)(({ theme }) => ({
  height: 4,
  color: 'transparent',
  padding: '13px 0',
  '& .MuiSlider-thumb': {
    height: 12,
    width: 12,
    backgroundColor: '#34BCF2',
    boxShadow: '0px 0px 20px #34BCF2'
  },
  '& .MuiSlider-track': {
    height: 4,
    background: 'linear-gradient(90deg, #37366B 0%, #33BCF2 100%)'
  },
  '& .MuiSlider-rail': {
    height: 4,
    background: '#E0E0E0',
    opacity: 1
  },
  '& .MuiSlider-mark': {
    backgroundColor: '#E0E0E0',
    height: 10,
    width: 2,
    '&.MuiSlider-markActive': {
      opacity: 0.8,
      backgroundColor: '#37578C'
    }
  },
  '& .MuiSlider-valueLabelOpen': {
    backgroundColor: '#34BCF2',
    fontFamily: 'Gilroy',
    borderRadius: '10px',
    top: '-2px',

    '&::before': {
      width: '6px',
      height: '6px',
      transform: 'rotate(45%)'
    }
  }
}));
