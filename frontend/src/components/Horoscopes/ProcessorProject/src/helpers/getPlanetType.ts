const planets = [
  {
    'value': 'Ascendant',
    'type': 'primaryData'
  }, {
    'value': 'Sun',
    'type': 'primaryData'
  }, {
    'value': 'Moon',
    'type': 'primaryData'
  }, {
    'value': 'Mars',
    'type': 'primaryData'
  }, {
    'value': 'Mercury',
    'type': 'primaryData'
  }, {
    'value': 'Venus',
    'type': 'primaryData'
  }, {
    'value': 'Jupiter',
    'type': 'primaryData'
  }, {
    'value': 'Saturn',
    'type': 'primaryData'
  }, {
    'value': 'Ketu',
    'type': 'primaryData'
  }, {
    'value': 'Rahu',
    'type': 'primaryData'
  }, {
    'value': 'Neptune',
    'type': 'transsaturns'
  }, {
    'value': 'Uranus',
    'type': 'transsaturns'
  }, {
    'value': 'Pluto',
    'type': 'transsaturns'
  }, {
    'value': 'Hora Lagna',
    'type': 'specialLagna'
  }, {
    'value': 'Ghati Lagna',
    'type': 'specialLagna'
  }, {
    'value': 'Varnada Lagna',
    'type': 'specialLagna'
  }, {
    'value': 'Sree Lagna',
    'type': 'specialLagna'
  }, {
    'value': 'Pranapada Lagna',
    'type': 'specialLagna'
  }, {
    'value': 'Bhava Lagna',
    'type': 'specialLagna'
  }, {
    'value': 'Parivesha',
    'type': 'upagraha'
  }, {
    'value': 'Indrachapa',
    'type': 'upagraha'
  }, {
    'value': 'Vyatipata',
    'type': 'upagraha'
  }, {
    'value': 'Upaketu',
    'type': 'upagraha'
  }, {
    'value': 'Kala',
    'type': 'upagraha'
  }, {
    'value': 'Mrityu',
    'type': 'upagraha'
  }, {
    'value': 'Artha Prahara',
    'type': 'upagraha'
  }, {
    'value': 'Yama Ghantaka',
    'type': 'upagraha'
  }, {
    'value': 'Dhooma',
    'type': 'upagraha'
  }, {
    'value': 'Mandi',
    'type': 'mandyGulika'
  }, {
    'value': 'Gulika',
    'type': 'mandyGulika'
  }
];

export const getPlanetType = (planet: string) => {
  const targetPanet = planets.find(({ value }) => planet.toLowerCase() === value.toLowerCase());

  if (!targetPanet) {
    return '';
  }

  return targetPanet.type;
};
