import React from 'react';

export const RowContext = React.createContext<any>({
  planets: [],
  setMaxPlanets: () => {}
});
