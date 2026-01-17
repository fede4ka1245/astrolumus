import { StellarObjectType } from '../../models/enums/StellarObjectType';

const getGalaxyOrbis = (planet: string) => {
  if (planet === 'Sun' || planet === 'Moon' || planet === 'Jupiter' || planet === 'Saturn') {
    return 2 * 60;
  }

  return 1 * 60;
};

const getStarOrbis = (planet: string) => {
  if (planet === 'Sun' || planet === 'Moon') {
    return 1 * 60;
  }

  if (planet === 'Jupiter' || planet === 'Saturn') {
    return 1 * 60;
  }

  return 1 * 60;
};

const getNebulaAndStarsOrbis = (planet: string) => {
  if (planet === 'Jupiter' || planet === 'Saturn' || planet === 'Mercury' || planet === 'Venus' || planet === 'Mars' || planet === 'Rahu' || planet === 'Ketu') {
    return 1 * 60;
  }

  return 1.5 * 60;
};

const getCloseStarOrbis = (planet: string) => {
  if (planet === 'Sun' || planet === 'Moon') {
    return 3.59 * 60;
  }

  if (planet === 'Jupiter' || planet === 'Saturn') {
    return 3.59 * 60;
  }

  if (planet === 'Ketu') {
    return 2 * 60;
  }

  return 1 * 60;
};

export const getOrbis = (stellarObjectType: number, planet: string) => {
  if (planet === 'Ascendant') {
    if (stellarObjectType === StellarObjectType.CloseStar) {
      return 60 * 3.59;
    }

    return 1 * 59;
  }

  if (stellarObjectType === StellarObjectType.Star) {
    return getStarOrbis(planet);
  }

  if (stellarObjectType === StellarObjectType.Galaxy) {
    return getGalaxyOrbis(planet);
  }

  if (stellarObjectType === StellarObjectType.Nebula || stellarObjectType === StellarObjectType.Stars) {
    return getNebulaAndStarsOrbis(planet);
  }

  return getCloseStarOrbis(planet);
};
