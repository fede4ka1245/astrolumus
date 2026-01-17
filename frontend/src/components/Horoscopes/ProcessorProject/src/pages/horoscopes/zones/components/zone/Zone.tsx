import React from 'react';
import { CardActionArea, Tooltip, ClickAwayListener, Typography, Grid } from '@mui/material';
import styles from './Zone.module.scss';
import { Zone as ZoneProps } from '../../../../../models/types/Zone';

const Zone = ({ value, tip, color }: ZoneProps) => {
  const [open, setOpen] = React.useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Tooltip
        open={open}
        onClose={handleTooltipClose}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        title={<Grid p={'2px'}>
          <Typography fontFamily={'Gilroy'} fontWeight={'bold'} fontSize={'16px'}>
            {tip?.title}
          </Typography>
          <Typography fontFamily={'Gilroy'} fontSize={'16px'}>
            {tip?.text}
          </Typography>
        </Grid>}
        arrow>
        <CardActionArea sx={{ borderRadius: '50%' }} onClick={handleTooltipOpen}>
          <div style={{ color }} className={styles.main}>
            {value}
          </div>
        </CardActionArea>
      </Tooltip>
    </ClickAwayListener>
  );
};

export default Zone;
