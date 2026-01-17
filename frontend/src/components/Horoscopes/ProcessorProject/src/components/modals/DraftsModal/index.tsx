import { useState, useEffect, useCallback } from 'react';
import { Grid } from '@mui/material';
import Modal from '../../modal/Modal';
import TextGradient from '../../textGradient/TextGradient';
import Draft from './Draft';
import ButtonClose from '../../buttonClose/ButtonClose';
import DraftSkeleton from '../../skeletons/DraftSkeleton';
import { useAppSelector } from '../../../store/store';
import { IServerTopic } from '../../../models/interfaces/topic';
import { ModalProps } from '../../modal/ModalProps';
import { getDrafts } from '../../../api/getDrafts';
import Options from '../../options/Options';
import { IOptionItem } from '../../../models/interfaces/options';

export interface DraftsProps extends ModalProps {
}

const filterSettings = [
  {
    label: 'Черновики',
    value: 'drafts',
    params: {
      status: 'not_checked'
    }
  },
  {
    label: 'В архиве',
    value: 'archive',
    params: {
      status: ['archive', 'blocked', 'temporary_blocked']
    }
  }
];

const DraftModal = ({ isOpen, close }: DraftsProps) => {  
  const [drafts, setDrafts] = useState<IServerTopic[]>([]);
  const { userInfo } = useAppSelector(state => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [filtredParam, setFilteredParam] = useState<IOptionItem>(filterSettings[0]);

  const getDraftsHandler = useCallback((params: object) => {
    setLoading(true);
    getDrafts({
      user: userInfo.id,
      ...params
    })
      .then(res => {
        setDrafts(res.data.results);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userInfo.id]);

  useEffect(() => {
    if (isOpen) {
      getDraftsHandler(filtredParam.params);
    } else {
      setDrafts([]);
    }
  }, [isOpen]); 

  const setFilter = useCallback((option: IOptionItem) => {
    getDraftsHandler(option.params);
    setFilteredParam(option);
  }, [getDraftsHandler]);

  return (
    <Modal isOpen={isOpen} close={close} height={'var(--modal-page-height)'}>
      <Grid container direction={'column'} px={2} py={2}>
        <Grid container item justifyContent={'space-between'} alignItems={'center'} mb={2}>
          <Grid item>
            <TextGradient
              textAlign={'center'}
              textTransform={'uppercase'}
              fontWeight={'bold'}
            >
              Черновики
            </TextGradient>
          </Grid>
          <ButtonClose onClick={close}/>
        </Grid>
        <Grid width={'100%'} mb={2}>
          <Options options={filterSettings} value={filtredParam.value} setValue={setFilter} isOutlined isScrollable/>
        </Grid>
        <Grid>
          { !loading 
            ? drafts.map(item => (
              <Grid key={item.id} mb={2}>
                <Draft 
                  filtredParam={filtredParam}
                  topic={item} 
                  getDrafts={getDraftsHandler}
                  close={close}/>
              </Grid>
            ))
            : Array(8).fill(0).map((item, index) => (
              <Grid key={index} mb={2}>
                <DraftSkeleton/>
              </Grid>
            ))
          }
        </Grid>
      </Grid>
    </Modal>
  );
};

export default DraftModal;
