import { HoroscopeData } from '../models/types/HoroscopeData';
import camelcaseKeys from 'camelcase-keys';
import { getFormattedGreenwich } from '../helpers/getFormattedGreenwich';
import { getFormattedDegreeTable } from '../helpers/getFormattedDegreeTable';
import { DegreeTable } from '../models/types/DegreeTable';
import { getFormattedMaps } from '../helpers/getFormattedMaps';
import authRequest from './authRequest';

interface GetVarshpahalaProps extends HoroscopeData {
  year: number
}

export const getVarshpahala = async ({ userName, latitude, longitude, date, time, hours, minutes, greenwich, year }: GetVarshpahalaProps) => {
  const { data } = await authRequest.post(`${import.meta.env.VITE_APP_API_URL}/horoscope/get-varshaphala/`, {
    name_user: userName,
    latitude,
    longitude,
    dt: date.split('.').reverse().join('-') + 'T' + time,
    part_world: getFormattedGreenwich(greenwich),
    tz_hour: Number(hours) || null,
    tz_minutes: minutes || null,
    year
  });

  const dashiTable = camelcaseKeys(data?.data?.dashiMap, { deep: true });
  const horoscopeDate = data.data?.dt;
  const r = /\d+/;
  const muntkha = data.data?.varshesha.match(r);
  const yogasTable = camelcaseKeys(data?.data?.yogaTable, { deep: true });
  const yearMasterTable = data?.data?.main.map((tableItem: any) => ({
    sign: tableItem?.point,
    planet: tableItem?.graxa,
    pvb: tableItem?.pvb
  }));
  const yearMaster = data?.data?.ruler_year;
  const degreeTable = getFormattedDegreeTable(data?.data?.rashiMap) as DegreeTable;
  const varshpahalaMaps = getFormattedMaps(data?.data?.horoscopeMaps);

  return {
    dashiTable,
    yogasTable,
    yearMasterTable,
    yearMaster,
    degreeTable,
    varshpahalaMaps,
    horoscopeDate,
    muntkha
  };
};
