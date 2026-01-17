import React, { useRef } from 'react';
import { CardActionArea, Grid, Typography } from '@mui/material';
import styles from '../../pages/menu/Menu.module.scss';
import { TransparentButtonProps } from './TransparentButtonProps';
import AspectRatio from '@mui/joy/AspectRatio';

const TransparentButton = ({ image, label, onClick, isSquare } : TransparentButtonProps) => {
  const transparentButtonRef = useRef<HTMLElement>(null);

  return (
    <div>
      <CardActionArea sx={{ borderRadius: '10px', aspectRatio: isSquare ? '1 / 1' : '2 / 1' }}>
        <AspectRatio ratio={isSquare ? 1 / 1 : 2 / 1}>
          <section ref={transparentButtonRef} className={styles.transparentButton} onClick={() => onClick()}>
            <Grid
              container
              display={'flex'}
              justifyContent={'center'}
              direction={'column'}
              alignItems={'center'}
              width={'100%'}
              height={'100%'}
            >
              <Grid item>
                <>
                  { image }
                </>
              </Grid>
              <Grid item mt={1}>
                <Typography textAlign={'center'} color={'white'} fontWeight={'bold'} fontFamily={'Gilroy'} fontSize={16}>
                  { label }
                </Typography>
              </Grid>
            </Grid>
          </section>
        </AspectRatio>
      </CardActionArea>
    </div>
  );
};

export default TransparentButton;
