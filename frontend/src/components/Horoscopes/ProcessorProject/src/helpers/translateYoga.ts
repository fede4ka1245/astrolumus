const yogas = [
  {
    'value': 'Ithasala Yoga',
    'label': 'Итхасала-йога'
  }, {
    'value': 'Eesarapha Yoga',
    'label': 'Эсарапха-йога'
  }, {
    'value': 'Nakta Yoga',
    'label': 'Накта-йога'
  }, {
    'value': 'Kamboola Yoga',
    'label': 'Камбула-йога'
  }, {
    'value': 'Musaripha Yoga',
    'label': 'Мутхасила-йога'
  }, {
    'value': 'Muthasila Yoga',
    'label': 'Мутхасила-йога'
  }, {
    'value': 'Yamaya Yoga',
    'label': 'Ямайа-йога'
  }
];

export const translateYoga = (value: string) => {
  const targetYoga = yogas.find((planet) => planet.value.toLowerCase() === value);

  return targetYoga?.label || value;
};
