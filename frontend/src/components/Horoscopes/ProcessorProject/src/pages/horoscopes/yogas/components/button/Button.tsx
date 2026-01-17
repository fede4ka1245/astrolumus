import React, { useCallback, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import styles from './Button.module.scss';
import Modal from './modal/Modal';

type ButtonType = {
  bgColor?: string,
  text: string
  textColor?: string,
  hintColor?: string,
  hint?: string,
}

const Button = ({ bgColor, text, textColor, hintColor, hint }: ButtonType) => {
  const [isClicked, setIsClicked] = useState(false);

  const toggleIsClicked = useCallback(() => {
    setIsClicked(!isClicked);
  }, [isClicked]);

  return (
    <Grid container bgcolor={bgColor || 'white'} className={styles.main} onClick={toggleIsClicked}>
      <Modal
        title={'Солнце - Сатурн'}
        text={'Эта йога образуется, если две грахи обмениваются своими управляющими раши, а также накшатрами или караками домов. Результат зависит от того, какими бхавами владеют вовлеченные грахи. Паривартхана-йогу можно назвать сильнейшей формой взаимоотношений (самбандха), которые могут существовать между двумя грахами, сильнее, чем их взаимная связь через соединение или взаимные аспекты.'}
        isOpen={isClicked}
        close={toggleIsClicked}
      />
      {hint && <Box bgcolor={hintColor || '#FF7474'} className={styles.hint}>
        {hint}
      </Box>}
      <Typography color={textColor || '#5C5B9F'} fontFamily={'Gilroy'} fontStyle={'normal'} fontWeight={700} fontSize={'18px'}>
        {text}
      </Typography>
    </Grid>
  );
};

export default Button;
