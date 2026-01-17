import { DashiReturnType } from '../models/types/GetDashi';
import { DashiTableRow } from '../models/types/DashiTableRow';

interface GetFormattedDashi extends DashiReturnType {
  planets?: string []
}

const getFormattedDashi = (data: Array<any>, planets?: string []): GetFormattedDashi => {
  const dashi: DashiTableRow [] = [];

  for (const period of data) {
    const currentPlanets = planets ? [...planets, period.name] : [period.name];

    dashi.push({
      planet: period.name,
      dateStart: period.startDate.split(' ')[0],
      dateEnd: period.endDate.split(' ')[0],
      timeStart: period.startDate.split(' ')[1],
      timeEnd: period.endDate.split(' ')[1],
      planets: planets || [],
      subTable: period.subPeriods ? getFormattedDashi(period.subPeriods, currentPlanets).table as DashiTableRow [] : [] as DashiTableRow []
    });
  }

  return {
    table: dashi,
    dateStart: `${dashi[0].dateStart.split(' ')[0].split('.').reverse().join('-')} ${dashi[0].timeStart}`,
    dateEnd: `${dashi[dashi.length - 1].dateEnd.split(' ')[0].split('.').reverse().join('-')} ${dashi[dashi.length - 1].timeEnd}`,
    planets
  };
};

export {
  getFormattedDashi
};
export type { GetFormattedDashi };
