import React, { useCallback } from 'react';
import { Grid, Typography } from '@mui/material';
import Button from '../button/Button';

const ErrorBoundary = () => {
  const openMainPage = useCallback(() => {
    window.open('/', '_self');
  }, []);

  return (
    <Grid p={2}>
      <Typography fontWeight={'bold'} mt={4} fontSize={'24px'} lineHeight={'26px'}>
        Произошла критическая ошибка!
      </Typography>
      <Typography mt={2} fontSize={'18px'} lineHeight={'20px'} mb={3}>
        Мы уже знаем о данной ошибке и работаем над тем, чтобы ее исправить! Вы можете вернуться на главный экран и продолжить работу
      </Typography>
      <Button onClick={openMainPage} text={'Вернуться на главный экран'} />
    </Grid>
  );
};

export default ErrorBoundary;
