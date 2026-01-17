import { FC, useCallback } from 'react';
import { Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../models/enums/routes';

const TopicCreatorBar: FC = () => {
  const navigate = useNavigate();

  const navigateToTopicCreator = useCallback(() => {
    navigate(routes.topicCreator);
  }, []);

  return (
    <Grid 
      onClick={navigateToTopicCreator}
      item 
      style={{ background: 'linear-gradient(88.23deg, #37366B 0.29%, #5C5B9F 42.18%, #59ABDA 97.3%), #F0F0F3' }}
      px="18px" py="13px" borderRadius="10px"width={'100%'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
      <Typography fontSize="16px" fontWeight={700} color="#FFF">
        Создать тему
      </Typography>
    </Grid>
  );
};

export default TopicCreatorBar;
