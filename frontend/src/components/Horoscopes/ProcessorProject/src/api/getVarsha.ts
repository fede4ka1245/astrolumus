import { CountHoroscopeProps } from '../models/types/CountHoroscopeProps';
import processorRequest, { getProcessorProxyUrl } from './processorRequest';
import { getTimeZoneOffsetFromGreenwichData } from '../helpers/getTimeZoneOffsetFromGreenwichData';
import { getFormattedDashi } from '../helpers/getFormattedDashi';
import { getFormattedMaps } from '../helpers/getFormattedMaps';
import { getFormattedDegreeTable } from '../helpers/getFormattedDegreeTable';
import { MapOption } from '../models/types/MapOption';
import { DegreeTable } from '../models/types/DegreeTable';
import { DashiReturnType } from '../models/types/GetDashi';
import { Muntha } from '../models/types/Muntha';
import { YearMasterTableRow } from '../models/types/YearMasterTableRow';
import { YogaTableRow } from '../models/types/YogaTable';
import { translatePlanetName } from '../helpers/translatePlanetName';
import { Language } from '../models/enums/Language';
import { mapNames } from '../helpers/mapNames';
import { HoroscopeSettings } from '../store/reducers/horoscopeSettings';
import { getSettingsParams } from '../helpers/horoscopeSettings';

export interface GetVarshaProps extends CountHoroscopeProps {
  year: number | string,
  month?: number | string,
  settings?: HoroscopeSettings
}

export interface GetVarsha {
  maps: MapOption [],
  degreeTable: DegreeTable,
  dashi: DashiReturnType,
  muntha: Muntha,
  yearMaster: string,
  yearMasterTable: YearMasterTableRow [],
  date: string,
  yogasTable: YogaTableRow []
}

const getYogaConnectionType = (connection: string) => {
  if (['4/10', '1/7'].includes(connection)) {
    return 'red';
  }

  return 'green';
};

const getYogaType = (name: string) => {
  if (['Musaripha Yoga', 'Eesarapha Yoga'].includes(name)) {
    return 'important';
  }

  if (['Ithasala Yoga', 'Muthasila Yoga'].includes(name)) {
    return 'success';
  }

  return 'red';
};

export const getVarsha = async ({ address, userInfo, year, month, settings }: GetVarshaProps): Promise<GetVarsha> => {
  const { data } = await processorRequest.get(`${getProcessorProxyUrl()}/pravesha/varsha/`, {
    params: {
      lat: address.coordinates.latitude,
      lon: address.coordinates.longitude,
      tz: getTimeZoneOffsetFromGreenwichData(address.timeZone.greenwich, address.timeZone.hours, address.timeZone.minutes),
      dt: `${userInfo.date} ${userInfo.time}`,
      year,
      month,
      ...getSettingsParams(settings)
    }
  });

  const dashi = getFormattedDashi(data.data.dasa.periods);
  const maps = getFormattedMaps(data.data);
  const degreeTable = getFormattedDegreeTable(data.data);
  const muntha = [];

  for (const item of Object.entries(data.data.muntha)) {
    const [key, value] = item as any [];

    muntha.push({
      sign: value?.sign?.id,
      house: value?.house?.id,
      mapName: mapNames[key as keyof typeof mapNames]
    });
  }

  const yearMaster = data.data.yearLord.name;
  const yearMasterTable: YearMasterTableRow [] = [];
  const date = `${data.data.birthInfo.date} ${data.data.birthInfo.time}`;
  const yogasTable: YogaTableRow [] = [];

  for (const yoga of data.data.yogas) {
    if (!yoga?.parties) {
      continue;
    }
    
    yogasTable.push({
      planets: [...yoga.parties.map((planet: any) => planet.name)] as string [],
      yoga: {
        name: yoga?.mediator ? translatePlanetName(yoga?.mediator.name, Language.Ru, true) : yoga.name,
        fullName: yoga.name,
        type: getYogaType(yoga.name)
      },
      connection: {
        connection: yoga?.position,
        type: getYogaConnectionType(yoga?.position)
      }
    });
  }

  for (const candidate of data.data.yearLordCandidates) {
    const targetPlanet = data.data.bodies.rasi.find((planet: any) => planet.id === candidate.id);

    yearMasterTable.push({
      sign: targetPlanet?.sign?.name,
      planet: targetPlanet?.name,
      pvb: candidate?.strength,
      role: candidate.role
    });
  }

  return {
    dashi,
    maps,
    degreeTable,
    muntha,
    yearMaster,
    yearMasterTable,
    date,
    yogasTable
  };
};
