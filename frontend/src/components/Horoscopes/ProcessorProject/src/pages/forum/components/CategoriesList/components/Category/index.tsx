import { FC, useCallback } from 'react';
import { Typography, Grid, Button } from '@mui/material';
import { IForumCategory } from '../../../../../../models/interfaces/forum';
import { IServerTopic } from '../../../../../../models/interfaces/topic';
import TopicPreview from '../../../../../../components/TopicPreview';
import styles from './styles.module.scss';

interface IProps {
  category: IForumCategory;
  openModal: (category: IForumCategory) => void;
  topics: IServerTopic[]
}

const Category: FC<IProps> = ({ category, openModal, topics }) => {
  const getTopicDeclension = useCallback((number: number) => {
    if (number > 1 && number < 5) {
      return `${number} темы`;
    }
    if (number === 1) {
      return `${number} тема`;
    }
    if (number >= 5 || number === 0) {
      return `${number} тем`;
    }
  }, []);

  return (
    <Grid>
      <div className={styles.main} onClick={() => openModal(category)}>
        <Typography className={styles.name} fontFamily={'Gilroy'} fontWeight={700} fontSize={'17px'}>
          {category.title}
        </Typography>
        <Typography whiteSpace={'nowrap'} ml={'auto'} className={styles.discussions} fontSize={'11px'} fontFamily={'Gilroy'}>
          {getTopicDeclension(category.topics_count)} 
        </Typography>
        {/* {
          topic?.messageCount > 0 && (
            <div className={styles.messages_count}>
              {topic.messageCount}
            </div>
          )
        } */}
      </div>
      <Grid display={'flex'} pr={2}>
        {category?.children && category?.children.length > 0 
          ? (
            <svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17.5361 7.17269L16.9361 7.71814L18.9543 9.98178H10.8271C6.0816 9.98178 2.23615 6.13632 2.23615 1.39087H1.41797C1.41797 6.59996 5.64524 10.8 10.8543 10.8272H18.9543L16.9089 13.0636L17.5089 13.6091L20.3998 10.3636L17.5361 7.17269Z"
                fill={'#37366B'}
              />
            </svg>
          )
          : null}
        <Grid container flex={1} mb={1}>
          {category?.children?.map((child: IForumCategory) => (
            <Grid item key={child.id} onClick={() => openModal(child)}>
              <Button>
                <Typography 
                  // color={!targetTag ? '#37366B' : category.id === targetTag ? '#37366B' : 'gray'} 
                  textTransform={'none'} 
                  className={styles.tag}
                  fontSize={'15px'}>
                  {child.title}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Grid> 
      <Grid width={'93vw'}>
        {topics.map(topic => (
          <Grid item width={'100%'} mb={2} key={topic.id}>
            <TopicPreview
              topic={topic}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Category;
