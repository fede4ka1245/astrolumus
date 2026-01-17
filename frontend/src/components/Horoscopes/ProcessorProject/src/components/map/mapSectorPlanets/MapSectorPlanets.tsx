import React from 'react';
import { Planet } from '../../../models/types/Planet';
import MapSectorPlanet from './MapSectorPlanet';

interface MapSectorPlanetsProps {
  planets: Planet [],
  type: string
}

const MapSectorPlanets = ({ planets, type }: MapSectorPlanetsProps) => {
  return (
    <>
      {planets.map((planet, index) => (
        <MapSectorPlanet planet={planet} type={type} key={index} />
      ))}
    </>
  );
};

export default MapSectorPlanets;
