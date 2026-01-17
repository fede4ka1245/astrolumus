import { useCallback, useEffect, useState } from 'react';
import { Grid, Typography, Checkbox } from '@mui/material';
import authRequest from '../../api/authRequest';
import { forumCategoryApi } from '../../api/forum';
import Modal from '../modal/Modal';
import { ModalProps } from '../modal/ModalProps';
import ButtonClose from '../buttonClose/ButtonClose';
import { IForumCategory } from '../../models/interfaces/forum';
import DraftSkeleton from '../skeletons/DraftSkeleton';
import { categorySort } from '../../helpers/sort';

interface TopicModalProps extends ModalProps {
  onChange?: (value: any) => void;
  category: number | null;
}

const CategoryModal = ({ isOpen, close, onChange, category }: TopicModalProps) => {
  const [categories, setCategories] = useState<Array<IForumCategory>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const initialPageSize = 200;

  useEffect(() => {
    getCategories();
  }, []);

  const selectCategory = useCallback((category: IForumCategory) => {
    if (onChange) {
      onChange(category);
    }
    close();
  }, [close, onChange]);

  const getCategories = useCallback(() => {
    setLoading(true);
    authRequest.get(forumCategoryApi(), {
      params: {
        limit: initialPageSize
      }
    })
      .then(res => setCategories(categorySort(res.data.results)))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Modal isOpen={isOpen} close={close} height={'var(--modal-page-height)'} background='#FFF'>
      <Grid p={2} height={'100%'}>
        <Grid mb={'20px'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography fontFamily={'Gilroy'} fontWeight={700} fontSize={'14px'} textTransform={'uppercase'} color={'#292E30'}>
            Выбор категории/подкатегории
          </Typography>
          <ButtonClose onClick={close}/>
        </Grid>
        {/* <Typography mb={'14px'} fontFamily={'Gilroy'} fontSize={'12px'} fontWeight={500} color={'#37366B'}>
          Выбрать все / Сбросить выбор
        </Typography> */}
        {!loading
          ? categories.map(item => (
            <Grid key={item.id}>
              <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'} mb={'5px'} onClick={() => selectCategory(item)}>
                <Typography fontFamily={'Gilroy'} fontWeight={600} fontSize={'14px'} color={'#37366B'} lineHeight={'33px'}>
                  {item.title}
                </Typography>
                <Checkbox
                  checked={item.id === category}
                  sx={{
                    '& .MuiSvgIcon-root': {
                      fontSize: '25px',
                      fill: '#37366B'
                    },
                    '& .MuiTouchRipple-root': {
                      color: '#979C9E'
                    }
                  }}
                />
              </Grid>
              <Grid display={'flex'} flexWrap={'wrap'} >
                {item && item?.children?.map((child) => (
                  <Grid key={child.id} display={'flex'} alignItems={'center'} onClick={() => selectCategory(child)} mr={2}>
                    <Typography 
                      fontFamily={'Gilroy'} fontWeight={500} fontSize={'12px'} color={'#37366B'} key={child.id} mr={1}>
                      {child.title}
                    </Typography>
                    <Checkbox
                      checked={child.id === category}
                      style={{
                        padding: 0
                      }}
                      sx={{
                        '& .MuiSvgIcon-root': {
                          fontSize: '17px',
                          fill: '#37366B'
                        },
                        '& .MuiTouchRipple-root': {
                          color: '#979C9E'
                        }
                      }}
                    />
                  </Grid>
                ))}

              </Grid>
            </Grid>
          ))
          : Array(8).fill(0).map((item, index) => (
            <Grid key={index}>
              <DraftSkeleton/>
            </Grid>
          ))}

      </Grid>
    </Modal>
  );
};

export default CategoryModal;
