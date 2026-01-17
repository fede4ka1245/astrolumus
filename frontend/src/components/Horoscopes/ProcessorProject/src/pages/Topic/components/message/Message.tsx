import styles from './Message.module.scss';
import { Grid, Skeleton, Typography } from '@mui/material';
import heart from './assets/like.svg';
import reply from './assets/reply.svg';
import classNames from 'classnames';

export interface MessageProps {
  text?: string,
  userName?: string,
  likesQuantity?: number,
  date?: string,
  isReply?: boolean,
  isCurrentUserMessage?: boolean,
  isGray?: boolean,
}

const Message = ({ isCurrentUserMessage, isGray }: MessageProps) => {
  return (
    <div className={classNames(styles.main, { [styles.isSelf]: isCurrentUserMessage, [styles.isGray]: isGray })}>
      {!isCurrentUserMessage && <Skeleton sx={{ background: 'gray' }} variant={'circular'} className={styles.photo} height={'40px'}/>}
      <Grid direction={'column'} container pt={2} pl={isCurrentUserMessage ? 2 : 4} pb={2} pr={2}>
        <Grid item container>
          <Grid item color={'#292E30'} fontWeight={400} fontSize={'10px'} fontFamily={'Gilroy'}>
            Евгений Приходько
          </Grid>
          <Grid pl={2} item sx={{ opacity: 0.6 }} color={'#292E30'} fontWeight={400} fontFamily={'Gilroy'} fontSize={'10px'}>
            Статус
          </Grid>
          <Grid item ml={'auto'} sx={{ opacity: 0.6 }} color={'#292E30'} fontWeight={400} fontFamily={'Gilroy'} fontSize={'10px'}>
            3 дня назад
          </Grid>
        </Grid>
        <Grid item pt={1} pb={1}>
          <Typography color={'#292E30'} fontWeight={400} fontFamily={'Gilroy'} fontSize={'14px'}>
            Меня волнует один вопрос - когда я пробую создать прогноз на политическое событие - у меня не рождается идей, как можно это провернуть, можете подсказать мне варианты решения проблемы, пожалуйста?
          </Typography>
        </Grid>
        {!isCurrentUserMessage && !isGray && <Grid item container justifyContent={'space-between'}>
          <Grid item display={'flex'}>
            <img src={heart} width={'20px'} height={'20px'} />
            <Typography pl={'4px'} sx={{ opacity: 0.6 }} color={'#292E30'} fontWeight={400} fontFamily={'Gilroy'} fontSize={'14px'}>
              0
            </Typography>
          </Grid>
          <Grid item>
            <Typography sx={{ opacity: 0.7 }} color={'#37366B'} fontWeight={600} fontFamily={'Gilroy'} fontSize={'14px'}>
              Получить ответ эксперта
            </Typography>
          </Grid>
          <Grid item>
            <img src={reply} />
          </Grid>
        </Grid>}
      </Grid>
    </div>
  );
};

export default Message;
