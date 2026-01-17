import { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useDispatch } from 'react-redux';
import { Keyboard } from '@capacitor/keyboard';
import { Grid, Typography } from '@mui/material';
import parse from 'html-react-parser';
import { IServerTopic, ITopicComment } from '../../../../../../models/interfaces/topic';
import authRequest from '../../../../../../api/authRequest';
import { forumCommentApi, forumImage as forumImageApi } from '../../../../../../api/forum';
import { setIsAppLoading } from '../../../../../../store/reducers/preferencesReducer';
import isQuillEmpty from '../../../../../../helpers/isQuillEmpty';
import webPathToFile from '../../../../../../helpers/webPathToFile';
import styles from './styles.module.scss';
import { pickImage } from '../../../../../../helpers/pickImage';
import Input from '../../../../../../components/input/Input';
import { InputType } from '../../../../../../components/input/InputType';
import TextGradient from '../../../../../../components/textGradient/TextGradient';
import { useAppSelector } from '../../../../../../store/store';
import { FirebaseEvent } from '../../../../../../helpers/firebase/firebaseEvent';
import { logFirebaseEvent } from '../../../../../../helpers/firebase';

interface IProps {
  topic: IServerTopic;
  isEdit: boolean;
  getComments: () => void;
  getCommentById: (commentId: number) => void;
  joinToTopic: () => void;
  scrollToBottom: () => void;
  selectedComment: ITopicComment | undefined;
  setSelectedComment: (comment: ITopicComment | undefined) => void;
  jumpToMessage: (comment: ITopicComment) => void;
  setIsEdit: (value: boolean) => void;
}

export interface ICommentForm {
  topic: number;
  text: string;
  image?: number;
}

export interface ICommentFormRef {
  setComment: (value: ICommentForm) => void;
}

const CommentForm = forwardRef<ICommentFormRef, IProps>((props, ref) => {
  const [comment, setComment] = useState<ICommentForm>({
    topic: props.topic.id,
    text: ''
  });
  const [image, setImage] = useState<string | null>(null);
  const dispatch = useDispatch();
  const isFocused = useRef<boolean>(false);
  const inputRef = useRef<any>();
  const userId = useAppSelector(state => state.user.userInfo.id);

  useEffect(() => {
    if (props.selectedComment) {
      inputRef.current.focus();
    }
  }, [props.selectedComment]);

  useImperativeHandle(ref, () => ({
    setComment
  }));

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      if (isFocused.current) {
        window.scrollTo(0, document.body.scrollHeight);
      }
    });

    return () => {
      Keyboard.removeAllListeners();
    };
  }, []);

  const clearComment = useCallback(() => {
    setComment({
      topic: props.topic.id,
      text: ''
    });
    props.setSelectedComment(undefined);
    props.setIsEdit(false);
    setImage(null);
  }, [props]);

  const sendComment = useCallback((imageId?:number) => {
    if (!isQuillEmpty(comment.text) || imageId) {
      dispatch(setIsAppLoading(true));
      authRequest.post(forumCommentApi(), {
        comment: props.selectedComment?.id,
        image_id: imageId,
        ...comment
      })
        .then(async res => {
          try {
            props.getComments();
            const comment = { ...res.data, comment: null };
            await props.jumpToMessage(comment);
            props.scrollToBottom();
            logFirebaseEvent({
              name: FirebaseEvent.writeCommentInTopic
            });
          } finally {
            clearComment();
          }
        })
        .finally(() => {
          dispatch(setIsAppLoading(false));
        });
    }
  }, [clearComment, comment, dispatch, props]);

  const sendWithImage = useCallback(async () => {
    if (image) {
      const file = { 
        image: await webPathToFile(image, 'image_original'),
        image_original: await webPathToFile(image, 'image_original')
      };
      dispatch(setIsAppLoading(true));
      authRequest.post(forumImageApi(), file, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((res) => {
          sendComment(res.data.id);
        })
        .catch(() => {
          sendComment();
        });
    } else {
      sendComment();
    }
  }, [dispatch, image, sendComment]);

  const editComment = useCallback(() => {
    if (!isQuillEmpty(comment.text) && props.selectedComment) {
      dispatch(setIsAppLoading(true));
      authRequest.put(forumCommentApi(props.selectedComment.id), comment)
        .then(res => {
          props.getCommentById(res.data.id);
          clearComment();
        })
        .finally(() => {
          dispatch(setIsAppLoading(false));
        });
    }
  }, [clearComment, comment, dispatch, props]);

  const sendImage = useCallback(async () => {
    const image = await pickImage();

    if (!image) {
      return;
    }

    setImage(image);
  }, []);

  const removeSelectedComment = useCallback(() => {
    props.setSelectedComment(undefined);
    props.setIsEdit(false);
  }, [props]);

  if (!props.topic.current_user_is_member && props.topic.user.id !== userId) {
    return (
      <div className={styles.comment_mask}>
        <Typography fontFamily={'Gilroy'} fontSize={'14px'} fontWeight={500} textAlign={'center'}>
          Вступите в тему, чтобы оставлять комментарии
        </Typography>
        <div onClick={props.joinToTopic} className={styles.member_button}>
          <TextGradient flex={1} fontFamily={'Gilroy'} fontWeight={700} fontSize={'14px'}>
            Вступить
          </TextGradient>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Grid   
        className={image ? styles.open_answer : styles.answer}>
        {
          image && (
            <div className={styles.image_wrapper}>
              <img src={image} className={styles.image}/>
              <div onClick={() => setImage(null)}>
                <svg width="19" height="22" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.33337 8.16667V13.1667M9.66671 8.16667V13.1667M1.33337 4.83333H14.6667M13.8334 4.83333L13.1109 14.9517C13.0809 15.3722 12.8928 15.7657 12.5843 16.053C12.2758 16.3403 11.8699 16.5 11.4484 16.5H4.55171C4.13016 16.5 3.72426 16.3403 3.41578 16.053C3.10729 15.7657 2.91914 15.3722 2.88921 14.9517L2.16671 4.83333H13.8334ZM10.5 4.83333V2.33333C10.5 2.11232 10.4122 1.90036 10.256 1.74408C10.0997 1.5878 9.88772 1.5 9.66671 1.5H6.33337C6.11236 1.5 5.9004 1.5878 5.74412 1.74408C5.58784 1.90036 5.50004 2.11232 5.50004 2.33333V4.83333H10.5Z" stroke="#F15024" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          )
        }
      </Grid>
      <Grid   
        
        className={props.selectedComment ? styles.open_answer : styles.answer}>
        {
          props.selectedComment && (
            <>
              <Grid height={'100%'} width={'3px'} bgcolor={'#37366B'}/>
              { props.selectedComment.image && <img src={props.selectedComment.image.image} height={50}/>}
              <Grid 
                container 
                height={'100%'} width={'100%'}
                justifyContent={'space-between'} 
                alignItems={'center'} 
                px={'10px'} py={'10px'}>
                <Grid item height={'40px'} width={'80%'} overflow={'hidden'} flexShrink={0} onClick={() => props.selectedComment && props.jumpToMessage(props.selectedComment)}>
                  {
                    !props.isEdit 
                      ? (
                        <Typography color={'#37366B'} fontWeight={400} fontFamily={'Gilroy'} fontSize={'14px'}>
                          Ответить: {props.selectedComment.user.first_name} {props.selectedComment.user.last_name}
                        </Typography>
                      ) 
                      : (
                        <Typography color={'#37366B'} fontWeight={400} fontFamily={'Gilroy'} fontSize={'14px'}>
                          Редактирование
                        </Typography>
                      )
                  }
                  <Typography color={'#292E30'} fontWeight={400} fontFamily={'Gilroy'} fontSize={'14px'}>
                    {parse(props.selectedComment.text)}
                  </Typography>
                </Grid>
                <Grid item onClick={removeSelectedComment}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 1.5L12.5 12.5" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12.5 1.5L1.5 12.5" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </Grid>
              </Grid>
            </>
          )
        }
      </Grid>
      <div className={styles.wrapper}>
        {
          !props.isEdit && (
            <div className={styles.send} onClick={sendImage}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 7V10M10 10V13M10 10H13M10 10H7M19 10C19 11.1819 18.7672 12.3522 18.3149 13.4442C17.8626 14.5361 17.1997 15.5282 16.364 16.364C15.5282 17.1997 14.5361 17.8626 13.4442 18.3149C12.3522 18.7672 11.1819 19 10 19C8.8181 19 7.64778 18.7672 6.55585 18.3149C5.46392 17.8626 4.47177 17.1997 3.63604 16.364C2.80031 15.5282 2.13738 14.5361 1.68508 13.4442C1.23279 12.3522 1 11.1819 1 10C1 7.61305 1.94821 5.32387 3.63604 3.63604C5.32387 1.94821 7.61305 1 10 1C12.3869 1 14.6761 1.94821 16.364 3.63604C18.0518 5.32387 19 7.61305 19 10Z" stroke="#3F3F46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )
        }
        <Grid flex={1}>
          <Input
            maxRows={6}
            inputType={InputType.textareaAutosize}
            ref={inputRef}
            value={comment.text} onChange={value => setComment(prevState => ({ ...prevState, text: value }))}/>
        </Grid>
        <div className={styles.send} onClick={() => props.isEdit ? editComment() : sendWithImage()}>
          <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.6016 17L19.6016 19L10.6016 1L1.60156 19L10.6016 17ZM10.6016 17V9" stroke="#3F3F46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
});

CommentForm.displayName = 'CommentForm';

export default CommentForm;
