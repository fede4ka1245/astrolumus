import { useAppDispatch } from '../store/store';
import { useCallback } from 'react';
import { resetHoroscopes } from '../store/reducers/horoscopesReducer';
import { resetTransitions } from '../store/reducers/transitionReduser';
import { resetVarshpahala } from '../store/reducers/varshpahalaReducer';
import { resetRectification } from '../store/reducers/rectificationReducer';
import { resetDeepSky } from '../store/reducers/deepSkyReducer';

export const useClearHoroscope = () => {
  const dispatch = useAppDispatch();

  return useCallback(() => {
    dispatch(resetHoroscopes());
    dispatch(resetTransitions());
    dispatch(resetVarshpahala());
    dispatch(resetRectification());
    dispatch(resetDeepSky());
  }, [dispatch]);
};
