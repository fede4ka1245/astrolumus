import { DashiTableRow } from '../../models/types/DashiTableRow';

export const getPlanets = () => {
  const array: Array<DashiTableRow> = [];

  Array.from({ length: 10 }).forEach((_) => {
    array.push({
      planet: 'Марс',
      planets: [],
      dateStart: '01.01.2001',
      dateEnd: '01.01.2002',
      timeStart: '20:20',
      timeEnd: '20:20',
      subTable: []
    });
  });

  for (let i = 0; i < 10; i++) {
    for (let y = 0; y <= 10; y++) {
      array[i].subTable.push({
        planet: 'Юпитер',
        planets: 'Марс / Юпитер'.split('/'),
        dateStart: '01.01.2001',
        dateEnd: '01.01.2002',
        timeStart: '20:20',
        timeEnd: '20:20',
        subTable: []
      });
    }
  }

  for (let i = 0; i < 10; i++) {
    for (let y = 0; y <= 10; y++) {
      for (let x = 0; x <= 10; x++) {
        array[i].subTable[y].subTable.push({
          planet: 'Юпитер',
          planets: 'Марс / Юпитер / Венера'.split('/'),
          dateStart: '01.01.2001',
          dateEnd: '01.01.2002',
          timeStart: '20:20',
          timeEnd: '20:20',
          subTable: []
        });
      }
    }
  }

  return array;
};
