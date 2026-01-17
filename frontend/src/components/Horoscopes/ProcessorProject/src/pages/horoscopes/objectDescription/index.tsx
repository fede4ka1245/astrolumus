import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Modal from './components/modal/Modal';
import { ProcessorObjectType } from '../types';
import { useSearchParamsState } from '../../../hooks/useSearchParamsState';
import { useNavigate } from '../../../contexts/NavigationContext';
import {
  closeDescription, initDeepSkyObjects,
  initObjectDescription,
  ObjectDescriptionEvent,
  objectDescriptionEventBus,
  openTab,
  setObjectDescription
} from './store';
import { Grid, Skeleton, Typography } from '@mui/material';
import styles from './components/root/Root.module.scss';
import Options from '../../../components/options/Options';
import { TabValue } from './types/Tabs';
import ContentSkeleton from '../../../components/contentSkeleton/ContentSkeleton';
import { Description, DescriptionObject } from './types/Descriptions';
import OptionsSkeleton from '../../../components/optionsSkeleton/OptionsSkeleton';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import DeepSkyInfo from '../../../components/degreeTable/deepSkyInfo/DeepSkyInfo';
import { MasterConnection } from './types/MasterConnection';
import classNames from 'classnames';

const planetsIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 101, 102, 103];

const Index: React.FC = () => {
  const dispatch = useAppDispatch();
  const { objectDescription, tabs, targetTab, descriptions, isTabsLoading, period } = useAppSelector((state) => state.objectDescription);

  useEffect(() => {
    objectDescriptionEventBus.on(ObjectDescriptionEvent.closeDescription, () => {
      dispatch(closeDescription());
    });
    objectDescriptionEventBus.on(ObjectDescriptionEvent.openDescription, (data) => {
      dispatch(setObjectDescription(data.object));

      if (!planetsIds.includes(data?.object?.internalId)) {
        return;
      }

      if (data?.object?.typeId === ProcessorObjectType.Planet) {
        dispatch(initObjectDescription(data));
        dispatch(initDeepSkyObjects({ planetId: data.object.internalId as number }));
      } else if (data?.object?.typeId === ProcessorObjectType.House) {
        dispatch(initObjectDescription(data));
      }
    });
  }, []);

  const targetDescription = useMemo<any>(() => {
    if (descriptions) {
      return descriptions[targetTab as TabValue];
    }
  }, [descriptions, targetTab]);

  const html = useMemo(() => {
    if (targetTab === TabValue.Desc) {
      return { __html: objectDescription?.description || '' };
    }
    
    if (typeof targetDescription === 'string') {
      return { __html: targetDescription as string || '' };
    }

    return { __html: 'Описание добавляется' };
  }, [targetTab, targetDescription, objectDescription?.description]);
  
  const hasContent = useCallback((tabValue: TabValue): boolean => {
    if (!descriptions) return false;
    
    const desc = descriptions[tabValue];
    if (!desc) return false;
    
    // Если это строка
    if (typeof desc === 'string') {
      return desc.trim() !== '' && desc !== 'Описание добавляется';
    }
    
    // Если это объект Description
    const descObj = desc as Description;
    
    // Проверяем наличие deepSkyObjects
    if (descObj.deepSkyObjects && descObj.deepSkyObjects.length > 0) {
      return true;
    }
    
    // Проверяем наличие masterDescription
    if (descObj.masterDescription) {
      if (Array.isArray(descObj.masterDescription)) {
        return descObj.masterDescription.length > 0;
      }
      return true;
    }
    
    // Проверяем наличие description
    if (descObj.description && descObj.description.trim() !== '') {
      return true;
    }
    
    return false;
  }, [descriptions]);
  
  const tabsOptions = useMemo(() => {
    if (tabs) {
      const options = Object.entries(tabs).reduce((prev: any [], [value, label]) => {
        return [...prev, {
          label,
          value
        }];
      }, []);
      
      // Сортируем табы: сначала с контентом, потом без контента
      return options.sort((a, b) => {
        const aHasContent = hasContent(a.value as TabValue);
        const bHasContent = hasContent(b.value as TabValue);
        
        // Если оба с контентом или оба без контента, сохраняем исходный порядок
        if (aHasContent === bHasContent) return 0;
        
        // Таб с контентом идет первым
        return aHasContent ? -1 : 1;
      });
    }

    return [];
  }, [tabs, descriptions, hasContent]);

  const onTabChange = useCallback(({ value }: any) => {
    dispatch(openTab(Number(value)));
  }, []);

  const isStringDesc = useMemo(() => {
    return typeof targetDescription === 'string' || !targetDescription;
  }, [targetDescription]);

  const houseName = useMemo(() => {
    const names: { [key: number]: string } = {
      1: 'Первый дом',
      2: 'Второй дом',
      3: 'Третий дом',
      4: 'Четвёртый дом',
      5: 'Пятый дом',
      6: 'Шестой дом',
      7: 'Седьмой дом',
      8: 'Восьмой дом',
      9: 'Девятый дом',
      10: 'Десятый дом',
      11: 'Одиннадцатый дом',
      12: 'Двенадцатый дом'
    };
    
    if (objectDescription?.typeId === ProcessorObjectType.House) {
      return names[objectDescription.internalId];
    }
  }, [objectDescription]);
  
  const isPlanetDesign = useMemo(() => {
    return ProcessorObjectType.Planet === objectDescription?.typeId &&
      planetsIds.includes(objectDescription?.internalId as number);
  }, [objectDescription]);
  
  const isTabsVisible = useMemo<boolean>(() => {
    return [ProcessorObjectType.Planet, ProcessorObjectType.House]
      .includes(objectDescription?.typeId as number) && isPlanetDesign;
  }, [objectDescription, isPlanetDesign]);

  return (
    <>
      <Grid display={'flex'} flexDirection={'column'} overflow={'hidden'}>
        <Grid position={'relative'} sx={{ overflow: 'clip' }}>
          <Grid
            className={classNames(styles.header, { [styles.planetHeader]: isPlanetDesign })}
            pl={2}
            pr={2}
            pt={2}
          >
            {ProcessorObjectType.House !== objectDescription?.typeId && objectDescription?.name}
            {ProcessorObjectType.House === objectDescription?.typeId && houseName}
          </Grid>
          {isPlanetDesign && <Grid pb={2} minHeight={'50px'}>
            <img
              className={styles.planet}
              width={120}
              height={120}
              loading='lazy'
              alt={'planet'}
              src={`/assets/planets/${objectDescription?.internalId}.png`}
            />
            {isTabsLoading && <Grid ml={2} mr={'120px'} fontFamily={'Gilroy'} borderRadius={'8px'}>
              <Skeleton
                width={'100%'}
                variant={'rectangular'}
                sx={{ height: '46px', margin: 0, borderRadius: '8px' }}
              />
            </Grid>}
            {period && <Grid ml={2} mr={'120px'} p={'4px 8px'} fontFamily={'Gilroy'} borderRadius={'8px'} sx={{ background: '#f3d112' }}>
              Обещания планеты сбудутся <br/>
              <b>c {period.dateStart} по {period.dateEnd}</b>
            </Grid>}
          </Grid>}
        </Grid>
        {isTabsVisible && <Grid>
          <Grid pl={2} pr={2}>
            {isTabsLoading && <OptionsSkeleton />}
            {!isTabsLoading && <Options
              options={tabsOptions}
              value={targetTab}
              isOutlined={true}
              setValue={onTabChange}
              isScrollable
            />}
          </Grid>
        </Grid>}
        {isStringDesc && (
          <Grid mt={2} className={styles.desc} pl={2} pr={2}>
            <p
              dangerouslySetInnerHTML={html}
            />
          </Grid>
        )}
        {!isStringDesc && targetDescription && (targetDescription as Description)?.deepSkyObjects && (
          <Grid p={2}>
            {(targetDescription as Description)?.isLoading && <ContentSkeleton />}
            {!(targetDescription as Description)?.isLoading && (
              <>
                {!(targetDescription as Description)?.deepSkyObjects?.length && (
                  <Typography>
                    Нет соединения с DeepSky объектами
                  </Typography>
                )}
                {Boolean((targetDescription as Description)?.deepSkyObjects?.length) && (
                  <Grid zIndex={-2}>
                    {(targetDescription as Description)?.deepSkyObjects?.map((value, index) => (
                      <Grid mt={1} key={index} bgcolor={'rgb(37, 28, 92)'} borderRadius={'16px'} overflow={'hidden'}>
                        <DeepSkyInfo
                          deepSkyObject={value}
                          planet={objectDescription?.name || 'Oбъект'}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </>
            )}
          </Grid>
        )}
        {targetDescription?.name && targetDescription?.description && <>
          <Grid mt={2} className={styles.desc} pl={2} pr={2}>
            <h2>
              {targetDescription?.name}
            </h2>
            <Grid
              pt={2}
              dangerouslySetInnerHTML={{ __html: targetDescription?.description }}
            />
          </Grid>
        </>}
        {targetDescription && (targetDescription as Description)?.masterDescription && (
          <>
            {Array.isArray((targetDescription as Description)?.masterDescription) && (
              ((targetDescription as Description)?.masterDescription as MasterConnection[]).map(({ description }, index) => (
                <Grid mt={2} className={styles.desc} pl={2} pr={2} key={index}>
                  <p
                    dangerouslySetInnerHTML={{ __html: description || 'no-data' }}
                  />
                </Grid>
              ))
            )}
            {!Array.isArray((targetDescription as Description)?.masterDescription) && (
              <Grid mt={2} className={styles.desc} pl={2} pr={2}>
                <p
                  dangerouslySetInnerHTML={{ __html: ((targetDescription as Description)?.masterDescription as MasterConnection).description || 'no-data' }}
                />
              </Grid>
            )}
          </>
        )}
      </Grid>
    </>
  );
};

const ObjectDescription: React.FC = () => {
  const [isCollapse, setIsCollapse] = useState(false);
  const [isOpen, setIsOpen] = useSearchParamsState<boolean>('isObjectDescriptionOpen', false);
  const navigate = useNavigate();

  const closeObjectDescription = useCallback(() => {
    if (!isOpen) {
      return;
    }

    objectDescriptionEventBus.emit(ObjectDescriptionEvent.closeDescription);
    navigate(-1);
  }, [navigate, isOpen]);

  useEffect(() => {
    objectDescriptionEventBus.on(ObjectDescriptionEvent.openDescription, ({ object }) => {
      setIsCollapse(object?.typeId === ProcessorObjectType.Planet || object?.typeId === ProcessorObjectType.Arudhs);
      setIsOpen(true, false);
    });
  }, []);

  return (
    <Modal isOpen={isOpen} close={closeObjectDescription} isCollapse={isCollapse}>
      <Index />
    </Modal>
  );
};

export default ObjectDescription;
