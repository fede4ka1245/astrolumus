import { useCallback, useEffect, useState } from 'react';
import { Grid, Typography, Checkbox } from '@mui/material';
import classNames from 'classnames';
import parse from 'html-react-parser';
import Modal from '../../../../components/modal/Modal';
import cross from './assets/cross.svg';
import { forumRulesApi } from '../../../../api/forum';
import authRequest from '../../../../api/authRequest';
import styles from './styles.module.scss';

interface RulesProps {
  isOpen: boolean,
  close: () => any,
}

const Rules = ({ isOpen, close }: RulesProps) => {
  const [checked, setChecked] = useState<boolean>(false);
  const [rule, setRule] = useState('');

  useEffect(() => {
    authRequest.get(forumRulesApi())
      .then(({ data }) => {
        setRule(data.description);
      });
  }, []);

  const sendConsent = useCallback(() => {
    close();
  }, [close]);

  return (
    <Modal isOpen={isOpen} close={close} height={'var(--modal-page-height)'}>
      <Grid sx={{ background: 'white' }} width={'100%'} height={'100%'} overflow={'scroll'} position={'relative'} p={3}>
        <img src={cross} className={styles.cross} onClick={close}/>
        <Grid item width={'100%'}>
          <div className={styles.title}>
            Правила поведения 
            на форуме
          </div>
          <div className={styles.rule}>
            {parse(rule)}
          </div>
        </Grid>
        <Grid item display={'flex'} alignItems={'center'} mb={2}>
          <Checkbox 
            sx={{
              '& .MuiSvgIcon-root': {
                fontSize: '25px',
                fill: '#37366B'
              },
              '& .MuiTouchRipple-root': {
                color: '#979C9E'
              }
            }}
            value={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <Typography fontFamily={'Gilroy'} fontSize={'15px'} color={'#37366B'}>
            Прочитал и согласен с правилами
          </Typography>
        </Grid>
        <Grid className={checked ? styles.button : classNames(styles.button, styles.hidden_button)} onClick={sendConsent}>
          Отправить согласие
        </Grid>
      </Grid>
    </Modal>
  );
};

export default Rules;
