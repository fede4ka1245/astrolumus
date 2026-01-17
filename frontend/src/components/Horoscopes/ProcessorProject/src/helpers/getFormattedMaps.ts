import { MapOption } from '../models/types/MapOption';
import { mapNames } from './mapNames';
import { MapSection } from '../models/types/MapSection';
import { getPlanetType } from './getPlanetType';

const getPlanets = (body: any, signId: string, type: string) => {
  return [...body.filter(({ name, sign }: any) => type === getPlanetType(name) && signId === sign.id)
    .map(({ name, movement, type, id }: any) => ({ name, id: name === 'Ascendant' ? 0 : id, movement, type }))];
};

const normalizeSign = (sign: number) => {
  if (sign > 12) {
    return sign - 12;
  }

  return sign;
};

const getPlanetsAspects = (planets: any []) => {
  const aspects: any [] = [];

  planets.forEach((planet) => {
    if (['Moon', 'Sun', 'Venus', 'Mercury', 'Jupiter', 'Rahu', 'Mars', 'Saturn'].includes(planet.name)) {
      aspects.push({
        ...planet,
        sign: { ...planet.sign, id: normalizeSign(planet.sign.id + 6) }
      });
    }

    if (planet.name === 'Rahu' || planet.name === 'Jupiter') {
      aspects.push({
        ...planet,
        sign: { ...planet.sign, id: normalizeSign(planet.sign.id + 4) }
      });

      aspects.push({
        ...planet,
        sign: { ...planet.sign, id: normalizeSign(planet.sign.id + 8) }
      });
    }

    if (planet.name === 'Mars') {
      aspects.push({
        ...planet,
        sign: { ...planet.sign, id: normalizeSign(planet.sign.id + 3) }
      });

      aspects.push({
        ...planet,
        sign: { ...planet.sign, id: normalizeSign(planet.sign.id + 7) }
      });
    }

    if (planet.name === 'Saturn') {
      aspects.push({
        ...planet,
        sign: { ...planet.sign, id: normalizeSign(planet.sign.id + 2) }
      });

      aspects.push({
        ...planet,
        sign: { ...planet.sign, id: normalizeSign(planet.sign.id + 9) }
      });
    }
  });

  return aspects;
};

export const getFormattedMaps = (data: any): MapOption[] => {
  const maps = [];

  for (const [key, options] of Array.from(Object.entries(data.houses))) {
    if (!mapNames[key as keyof typeof mapNames]) {
      continue;
    }

    const mapSections: MapSection[] = [];
    const body = data.bodies[key as keyof typeof data.bodies];

    for (const option of options as Array<any>) {
      const section = {
        house: option.id,
        signId: option.signId,
        arudhs: [...option.arudhas.map((arudha: any) => ({ ...arudha, isArudha: true }))],
        aspects: getPlanets(getPlanetsAspects(body), option.signId, 'primaryData'),
        mandyGulika: getPlanets(body, option.signId, 'mandyGulika'),
        primaryData: getPlanets(body, option.signId, 'primaryData'),
        specialLagna: getPlanets(body, option.signId, 'specialLagna'),
        transsaturns: getPlanets(body, option.signId, 'transsaturns'),
        upagraha: getPlanets(body, option.signId, 'upagraha')
      };

      mapSections.push(section);
    }

    maps.push({
      mapSections,
      label: mapNames[key as keyof typeof mapNames],
      value: mapNames[key as keyof typeof mapNames]
    });
  }
  
  maps.sort((firstMap, secondMap) => {
    return Number(firstMap.value.replace('D-', '')) - Number(secondMap.value.replace('D-', ''));
  });

  return maps;
};
