import { MapOption } from '../models/types/MapOption';
import { DegreeTable } from '../models/types/DegreeTable';
import { DashiReturnType } from '../models/types/GetDashi';
import { AshtakavargaTable } from '../models/types/AshtakavargaTable';
import { getFormattedMaps } from './getFormattedMaps';
import { getFormattedDegreeTable } from './getFormattedDegreeTable';
import { getFormattedDashi } from './getFormattedDashi';
import { MapTypeEnum } from '../models/types/MapType';
import { AshtakavargaTableRow } from '../models/types/AshtakavargaTableRow';

export interface FormattedHoroscopeData {
  maps: MapOption [],
  degreeTable: DegreeTable,
  dashiVim: DashiReturnType,
  ashtakavarga: AshtakavargaTable[],
}

const formatAshtakavargaTableRows = (rows: any [], firstHouse?: number, house?: number): AshtakavargaTableRow [] => {
  const table = [...rows.map((row, index) => {
    return {
      signId: index,
      mainInfo: row.bindu as string
    };
  })] as AshtakavargaTableRow [];

  const sorted = [...table];

  sorted.sort((firstRow, secondRow) => {
    const first = firstRow.signId + 1 < (firstHouse || 0) ? firstRow.signId + 12 : firstRow.signId;
    const second = secondRow.signId + 1 < (firstHouse || 0) ? secondRow.signId + 12 : secondRow.signId;

    return first - second;
  });

  return [...sorted.map((row, index) => ({ ...row, isHighlighted: index === house }))];
};

const formatAshtakavargaBavItems = (rows: any []) => {
  const result = [];

  for (let i = 0; i <= 7; i++) {
    result.push(rows.filter(({ bodyId }) => bodyId === i));
  }

  return result;
};

export const formatHoroscopeData = (data: any): FormattedHoroscopeData => {
  const maps = getFormattedMaps(data);
  const degreeTable: DegreeTable = getFormattedDegreeTable(data);
  const dashiVim = getFormattedDashi(data.dasa.periods);

  const firstHouse = (() => {
    const d1 = maps.find((map) => map.value === 'D-1');

    if (!d1?.mapSections?.length) {
      return;
    }

    return Number(d1?.mapSections.find(({ house }) => house === 1)?.signId);
  })();

  const sav = {
    tableName: 'SAV',
    table: formatAshtakavargaTableRows(data.ashtakavarga.sav, firstHouse),
    mapType: MapTypeEnum.North
  };

  const tables = [...formatAshtakavargaBavItems(data.ashtakavarga.bav).map((table, index) => {
    const planet = data.bodies.rasi.find((planet: any) => planet?.id === index) || data.bodies.rasi[0];

    return {
      tableName: planet?.name,
      type: 'BAV',
      table: formatAshtakavargaTableRows(table, firstHouse, planet.house.id - 1),
      mapType: MapTypeEnum.North
    };
  })];

  const ashtakavarga: AshtakavargaTable[] = [sav, ...tables];

  return { maps, degreeTable, dashiVim, ashtakavarga };
};
