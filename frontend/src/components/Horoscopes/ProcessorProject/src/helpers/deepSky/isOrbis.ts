export const isOrbis = (planetMinutes: number, stellarObjectMinutes: number, orbisMinutes: number) => {
  return Math.abs(planetMinutes - stellarObjectMinutes) <= orbisMinutes;
};
