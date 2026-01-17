import React, { useMemo } from 'react';
import { useAppSelector } from '../../store/store';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert, AlertTitle, Grid, Fade } from '@mui/material';

interface WarnInfoProps {
  mode?: 'dark' | 'light'
}

const WarnInfo = ({ mode = 'light' }: WarnInfoProps) => {
  const warnInfo = useAppSelector((state) => state.preferences.warnInfo);
  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode
      }
    });
  }, [mode]);
  
  return (
    <Fade in={warnInfo.isActive} timeout={400} mountOnEnter unmountOnExit>
      <div>
        <ThemeProvider theme={theme}>
          <Grid pt={2} pb={2}>
            <Alert severity="error" variant="outlined">
              <AlertTitle>
                <strong>{warnInfo.title}</strong>
              </AlertTitle>
              <div dangerouslySetInnerHTML={{ __html: warnInfo.text }}/>
            </Alert>
          </Grid>
        </ThemeProvider>
      </div>
    </Fade>
  );
};

export default WarnInfo;
