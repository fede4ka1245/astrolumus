import { useAppSelector } from '../store/store';
import { ProcessorObjectType } from '../pages/horoscopes/types';
import { useMemo } from 'react';

export const useGetProcessorObject = (type: ProcessorObjectType, id: number) => {
  const processorObjects = useAppSelector((state) => state.horoscopes.processorObjects);

  return useMemo(() => {
    // @ts-ignore
    return processorObjects[type][id];
  }, [processorObjects, type, id]);
};
