import { useAppDispatch } from '../store/store';
import { resetHoroscopes } from '../store/reducers/horoscopesReducer';
import { resetTransitions } from '../store/reducers/transitionReduser';
import { resetZones } from '../store/reducers/zonesReducer';
import { resetVarshpahala } from '../store/reducers/varshpahalaReducer';
import { useEffect } from 'react';

export const useResetHoroscopeOnUnmount = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(resetVarshpahala());
      dispatch(resetHoroscopes());
      dispatch(resetZones());
      dispatch(resetTransitions());
    };
  }, []);
};
