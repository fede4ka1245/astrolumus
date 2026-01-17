import { useGetHelpersElements } from '../store/selectors';
import { useMemo } from 'react';
import { HoroscopeHelpersElements } from '../models/enums/HoroscopeHelpersElements';

export const useGetIsHelpersElementsActive = () => {
  const helpersElements = useGetHelpersElements();

  return useMemo(() => {
    const isTranssaturnsActive = helpersElements.includes(HoroscopeHelpersElements.Transsaturns);
    const isArudhsActive = helpersElements.includes(HoroscopeHelpersElements.Arudhs);
    const isAspectsActive = helpersElements.includes(HoroscopeHelpersElements.Aspects);
    const isMandyAndGulikaActive = helpersElements.includes(HoroscopeHelpersElements.MandyAndGulika);
    const isSpecialLagnaActive = helpersElements.includes(HoroscopeHelpersElements.SpecialLagna);
    const isUpagrahsActive = helpersElements.includes(HoroscopeHelpersElements.Upagrahs);

    return {
      isTranssaturnsActive,
      isArudhsActive,
      isAspectsActive,
      isMandyAndGulikaActive,
      isSpecialLagnaActive,
      isUpagrahsActive
    };
  }, [helpersElements]);
};
