import React, { useEffect, useRef, useCallback } from 'react';
import { Grid, Typography } from '@mui/material';
import CategoriesList, { ICategoriesListRef } from './components/CategoriesList';
import TopicsList, { ITopicsListRef } from './components/TopicsList';
import CommentsList, { ICommentsListRef } from './components/CommentsList';
import Rules from './components/rules';
import Options from '../../components/options/Options';
import UserHeader from '../../components/userHeader/UserHeader';
import PageHeader from '../../components/pageHeader/PageHeader';
import Background from '../../components/background/Background';
import Search from './components/Search';
import DraftBar from '../../components/DraftBar';
import { LocalStorageKey } from '../../models/enums/LocalStorageKey';
import { IOptionItem } from '../../models/interfaces/options';
import { useAppSelector } from '../../store/store';
import { topicsFiltersSetting, topicsSortsSetting } from './settings';
import styles from './styles.module.scss';
import TopicCreatorBar from '../../components/TopicCreatorBar';
import { useNavigate } from 'react-router-dom';
import { processorRoutes } from '../astrlogicalProcessor/processorRoutes';
import { useSearchParamsState } from '../../hooks/useSearchParamsState';
import IconButton from '../../components/iconButton/IconButton';
import WarnInfo from '../../components/warnInfo/WarnInfo';
import { useIsPaymentsEnabled } from '../../hooks/useIsPaymentsEnabled';

const Forum = () => {
  const { id } = useAppSelector(state => state.user.userInfo);
  const topicsFilters = topicsFiltersSetting(id);
  const [filterTopicParam, setFilterTopicParam] = useSearchParamsState('filterTopicParam', topicsFilters[0]);
  const [sortTopicParam, setSortTopicParam] = useSearchParamsState('sortTopicParam', topicsSortsSetting[0]);
  const [isRulesOpen, setIsRulesOpen] = useSearchParamsState('isRulesOpen', false, false);
  const [isOpenSearch, setIsOpenSearch] = useSearchParamsState('isOpenSearchForum', false, false);
  const categoryListRef = useRef<ICategoriesListRef>(null);
  const commentsListRef = useRef<ICommentsListRef>(null);
  const topicsListRef = useRef<ITopicsListRef>(null);
  const navigate = useNavigate();
  const isPaymentsEnabled = useIsPaymentsEnabled();

  useEffect(() => {
    categoryListRef.current?.getCategories({ ...filterTopicParam.params, ...sortTopicParam.params });
    if (localStorage.getItem(LocalStorageKey.isForumRulesConfirmed) === null) {
      setIsRulesOpen(true);
      localStorage.setItem(LocalStorageKey.isForumRulesConfirmed, JSON.stringify({ isForumRulesConfirmed: true }));
    }
  }, []);

  const getListByType = useCallback(async (type: string, params: object) => {
    switch (type) {
    case 'categories':
      await categoryListRef.current?.getCategories(params);
      break;
    case 'commented':
      await commentsListRef.current?.getTopicComments(params);
      break;
    default:
      await topicsListRef.current?.getTopics(params);
      break;
    }
  }, []);

  const setTopicSort = useCallback((value: IOptionItem) => {
    getListByType(filterTopicParam.value, { ...value.params, ...filterTopicParam.params });
  }, [filterTopicParam.params, filterTopicParam.value, getListByType]);

  const setTopicFilter = useCallback((value: IOptionItem) => {
    getListByType(value.value, { ...value.params, ...sortTopicParam.params });
  }, [getListByType, sortTopicParam.params]);

  const renderSectionByType = useCallback((type: string) => {
    switch (type) {
    case 'categories':
      return <CategoriesList
        filterTopicParam={filterTopicParam} 
        sortTopicParam={sortTopicParam}
        ref={categoryListRef}
      />;
    case 'commented':
      return <CommentsList
        filterTopicParam={filterTopicParam} 
        sortTopicParam={sortTopicParam} 
        ref={commentsListRef}
      />;
    default:
      return <TopicsList 
        filterTopicParam={filterTopicParam} 
        sortTopicParam={sortTopicParam}
        ref={topicsListRef}
      />;
    }
  }, [filterTopicParam, sortTopicParam]);

  const onWalletClick = useCallback(() => {
    navigate(processorRoutes.rates);
  }, []);
  
  const openSearch = useCallback(() => {
    setIsOpenSearch(true);    
  }, [setIsOpenSearch]);
  
  const closeSearch = useCallback(() => {
    navigate(-1);
  }, []);

  if (isOpenSearch) {
    return (
      <Search closeSearch={closeSearch}/>
    );
  }

  return (
    <>
      <div className={styles.main}>
        <Background background={'#f0f0f3'} />
        <UserHeader/>
        <PageHeader 
          page={'Форум'}
          content={(
            <>
              {isPaymentsEnabled && <Grid item mr={3}>
                <IconButton onClick={onWalletClick}>
                  <svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.3136 13.9474V10.593C22.3136 9.49145 21.4175 8.59527 20.3159 8.59527H12.357C12.4472 8.26001 12.4941 7.9116 12.4941 7.55583C12.4941 7.21798 12.4515 6.88999 12.372 6.57651C13.1034 7.42837 14.1869 7.96959 15.3951 7.96959C17.5923 7.96959 19.3799 6.18205 19.3799 3.9848C19.3799 1.78755 17.5923 0 15.395 0C13.1978 0 11.4102 1.78755 11.4102 3.9848C11.4102 4.32264 11.4528 4.65069 11.5323 4.96411C10.8009 4.11226 9.71742 3.57103 8.50923 3.57103C6.31203 3.57103 4.52448 5.35863 4.52448 7.55583C4.52448 7.91155 4.57135 8.25991 4.66154 8.59527H2.05139C0.949846 8.59527 0.0537109 9.4914 0.0537109 10.593V24.0023C0.0537109 25.1038 0.949846 26 2.05139 26H20.3159C21.4174 26 22.3136 25.1038 22.3136 24.0023V20.6478C23.2314 20.5406 23.9461 19.7586 23.9461 18.8125V15.7828C23.9462 14.8366 23.2314 14.0546 22.3136 13.9474ZM15.395 1.6803C16.6657 1.6803 17.6995 2.7141 17.6995 3.9848C17.6995 5.25549 16.6657 6.2893 15.395 6.2893C14.1243 6.2893 13.0905 5.25549 13.0905 3.9848C13.0905 2.7141 14.1243 1.6803 15.395 1.6803ZM8.50928 5.25128C9.77998 5.25128 10.8138 6.28508 10.8138 7.55578C10.8138 7.92222 10.7293 8.27545 10.567 8.59522H6.45153C6.28928 8.2754 6.20478 7.92222 6.20478 7.55578C6.20483 6.28513 7.23858 5.25128 8.50928 5.25128ZM20.6333 24.0022C20.6333 24.1773 20.4909 24.3196 20.3158 24.3196H2.05134C1.8763 24.3196 1.73396 24.1772 1.73396 24.0022V10.5929C1.73396 10.4179 1.87635 10.2755 2.05134 10.2755C2.41356 10.2755 19.8794 10.2755 20.3158 10.2755C20.4909 10.2755 20.6333 10.4179 20.6333 10.5929V13.9345C20.1106 13.9345 15.2286 13.9345 14.7045 13.9345C13.7183 13.9345 12.916 14.7368 12.916 15.723C12.916 16.4251 12.916 18.6126 12.916 18.8723C12.916 19.8584 13.7183 20.6608 14.7045 20.6608C15.2285 20.6608 20.1106 20.6608 20.6333 20.6608V24.0022ZM22.2659 18.8124C22.2659 18.9051 22.1906 18.9804 22.0979 18.9804C21.8327 18.9804 15.1316 18.9804 14.7643 18.9804C14.6717 18.9804 14.5963 18.9051 14.5963 18.8124V15.7827C14.5963 15.6901 14.6717 15.6147 14.7643 15.6147C15.1398 15.6147 21.8376 15.6147 22.0979 15.6147C22.1905 15.6147 22.2659 15.6901 22.2659 15.7827V18.8124Z" fill="#37366B"/>
                  </svg>
                </IconButton>
              </Grid>}
              <Grid>
                <IconButton onClick={openSearch}>
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8.63636" cy="8.63636" r="7.63636" stroke="#C3C9CD" strokeWidth="2"/>
                    <path d="M14.0908 14.0909L19.0908 19.0909" stroke="#C3C9CD" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </IconButton>
              </Grid>
            </>
          )}
        />
        <Grid ml={2} mr={2}>
          <WarnInfo />
        </Grid>
        <Grid item pl={2} pr={2} width={'100%'} mb={0.5} mt={2}>
          <Options options={topicsFilters} value={filterTopicParam.value} setValue={(value) => {
            setTopicFilter(value);
            setFilterTopicParam(value);
          }} isOutlined isScrollable/>
        </Grid>
        <Grid item pl={2} pr={2} width={'100%'} mb={2}>
          <Options options={topicsSortsSetting} value={sortTopicParam.value} setValue={(value) => {
            setTopicSort(value);
            setSortTopicParam(value);
          }} isOutlined isScrollable/>
        </Grid>
        {filterTopicParam?.value === 'my_topic' && (
          <Grid px={2}>
            <Grid mb={2}>
              <DraftBar/>
            </Grid>
            <Grid mb={2}>
              <TopicCreatorBar/>
            </Grid>
          </Grid>
        )}
        {
          renderSectionByType(filterTopicParam.value)
        }
        <Typography textAlign={'center'} fontFamily={'Gilroy'} fontWeight={500} fontSize={'16px'} color={'#37366B'} onClick={() => setIsRulesOpen(true)}>
          Правила поведения на форуме
        </Typography>
        <Rules isOpen={isRulesOpen} close={() => navigate(-1)} />
      </div>
    </>
  );
};

export default Forum;
