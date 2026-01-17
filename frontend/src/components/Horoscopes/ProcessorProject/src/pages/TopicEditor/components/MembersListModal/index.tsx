import { FC, useState, useEffect, useCallback } from 'react';
import { Grid } from '@mui/material';
import { useMatch } from 'react-router-dom';
import Modal from '../../../../components/modal/Modal';
import TextGradient from '../../../../components/textGradient/TextGradient';
import UserForumPreview from '../../../../components/UserForumPreview';
import ButtonClose from '../../../../components/buttonClose/ButtonClose';
import UserPreviewSkeleton from '../../../../components/skeletons/UserPreviewSkeleton';
import { ModalProps } from '../../../../components/modal/ModalProps';
import { IMember } from '../../../../models/interfaces/topic';
import { MemberStatus } from '../../../../models/enums/topic';
import { routes } from '../../../../models/enums/routes';
import authRequest from '../../../../api/authRequest';
import { forumTopicRemoveMemberApi, forumTopicMembersApi } from '../../../../api/forum';
import styles from './styles.module.scss';

interface IProps extends ModalProps{
}

const MembersListModal: FC<IProps> = ({ isOpen, close }) => {
  const [searchText, setSearchText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [members, setMembers] = useState<IMember[]>([]);
  const match = useMatch(routes.TopicEditorId);
  const topicId = Number(match?.params.id);

  useEffect(() => {
    if (isOpen) {
      searchUser('');
    } else {
      setMembers([]);
    }
  }, [isOpen]);

  const getTopicMembers = useCallback((params: object) => {
    setLoading(true);
    authRequest.get(forumTopicMembersApi(), {
      params: {
        ...params,
        topic: topicId,
        status: MemberStatus.accepted
      }
    })
      .then(res => {
        setMembers(res.data.results);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [topicId]);

  const deleteMemberFromTopic = useCallback((member: IMember) => {
    setLoading(true);
    authRequest.post(forumTopicRemoveMemberApi(member.topic), {
      user: member.user.id
    })
      .then(res => {
        getTopicMembers({ query: searchText });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [getTopicMembers, searchText]);

  const searchUser = useCallback((text: string) => {
    setSearchText(text);
    setLoading(true);
    getTopicMembers({ user_query: text });
  }, [getTopicMembers]);

  return (
    <Modal isOpen={isOpen} close={close} height={'var(--modal-page-height)'}>
      <Grid container direction={'column'} pt={3} px={2} flex={1} position={'relative'} height={'90vh'} bgcolor={'#FFF'}>
        <Grid container item justifyContent={'space-between'} alignItems={'center'} mb={2}>
          <Grid item>
            <TextGradient
              textAlign={'center'}
              textTransform={'uppercase'}
              fontWeight={'bold'}
            >
              Участники
            </TextGradient>
          </Grid>
          <ButtonClose onClick={close}/>
        </Grid>
        <Grid position={'sticky'}>
          <Grid item className={styles.search} mb={4}>
            <Grid pl={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
              <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8.63636" cy="8.63636" r="7.63636" stroke="#C3C9CD" strokeWidth="2"/>
                <path d="M14.0908 14.0909L19.0908 19.0909" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Grid>
            <input placeholder={'Введите имя пользователя или id'} value={searchText} onChange={(e) => searchUser(e.target.value)}/>
            <Grid pr={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
              <svg width="15" height="15" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 1.5L12.5 12.5" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12.5 1.5L1.5 12.5" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Grid>
          </Grid>
        </Grid>
        <Grid flex={1} item>
          {!loading 
            ? members.map(item => (
              <Grid key={item.id} mb={2}>
                <UserForumPreview
                  user={item.user} 
                  withDeleteButton
                  onDelete={(id) => deleteMemberFromTopic(item)}/>
              </Grid>

            )) 
            : (
              Array(8).fill(0).map((item, index) => (
                <Grid key={index} mb={2}>
                  <UserPreviewSkeleton/>
                </Grid>
              ))
            )}
        </Grid>
        {/* <Grid pt={1} pb={1} item onClick={close}>
          <GradientButton>
          Готово
          </GradientButton>
        </Grid> */}
      </Grid>
    </Modal>
  );
};

export default MembersListModal;
