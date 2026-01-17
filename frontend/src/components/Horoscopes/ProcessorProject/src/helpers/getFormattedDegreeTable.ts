import { DegreeTable, DegreeTableParts } from '../models/types/DegreeTable';
import { mapNames } from './mapNames';
import { getPlanetType } from './getPlanetType';

export const getFormattedDegreeTable = (data: any) : DegreeTable => {
  const degreeTable: DegreeTable = [];

  for (const [key, options] of Array.from(Object.entries(data.bodies))) {
    if (!mapNames[key as keyof typeof mapNames]) {
      continue;
    }

    const table: DegreeTableParts = {
      primaryData: [],
      primaryUpagraha: [],
      transsaturns: [],
      mandyGulika: [],
      specialLagna: []
    };

    for (const option of options as Array<any>) {
      const targetTableItem = {
        house: option.house.id,
        sign: option.sign?.id,
        planet: {
          id: option.id || 0,
          name: option.name as string,
          additionalInfo: option.karaka?.name as string,
          isRetragraded: option.movement === 'R'
        },
        karaka: {
          id: option.karaka?.id,
          name: option.karaka?.name
        },
        degrees: +option.longitude?.textFormatSeconds.replaceAll("'", '').replaceAll('°', '').split(' ')[0],
        minutes: +option.longitude?.textFormatSeconds.replaceAll("'", '').replaceAll('°', '').split(' ')[1],
        naksantra: {
          id: option.nakshatra?.id,
          mainInfo: option.nakshatra?.name,
          additionalInfo: option.nakshatra?.lord?.name,
          pada: option.nakshatra?.pada
        }
      };

      if (getPlanetType(option.name) === 'mandyGulika') {
        table.mandyGulika.push(targetTableItem);
        continue;
      }

      if (getPlanetType(option.name) === 'primaryData') {
        table.primaryData.push(targetTableItem);
        continue;
      }

      if (getPlanetType(option.name) === 'specialLagna') {
        table.specialLagna.push(targetTableItem);
        continue;
      }

      if (getPlanetType(option.name) === 'transsaturns') {
        table.transsaturns.push(targetTableItem);
        continue;
      }

      if (getPlanetType(option.name) === 'upagraha') {
        table.primaryUpagraha.push(targetTableItem);
      }
    }

    degreeTable.push({
      tableName: mapNames[key as keyof typeof mapNames],
      table
    });
  }

  return degreeTable;
};
