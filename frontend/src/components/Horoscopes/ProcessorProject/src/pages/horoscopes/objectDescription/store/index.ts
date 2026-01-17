import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProcessorObject, ProcessorObjectType } from '../../types';
import { Tabs, TabValue } from '../types/Tabs';
import EventBus from 'js-event-bus';
import { Descriptions } from '../types/Descriptions';
import { getDeepSky } from '../../../../api/getDeepSky';
import { countDeepSky } from '../../../../helpers/deepSky/countDeepSky';
import { DegreeTable, DegreeTableItem, DegreeTableParts } from '../../../../models/types/DegreeTable';
import { CurrentDeepSkyObject } from '../../../../models/types/CurrentDeepSkyObject';
import { getHouseMasterConnection, getPlanetHouseConnection, getPlanetSignConnection } from '../api';
import { DegreeTableRow } from '../../../../models/types/DegreeTableRow';
import { MasterHouseConnection } from '../types/ConnectionTypes';
import { MasterConnection } from '../types/MasterConnection';
import { DashiTableRow as IDashiTableRow } from '../../../../models/types/DashiTableRow';
import moment from 'moment';
import { setVarshpahalaDegreeTable } from '../../../../store/reducers/varshpahalaReducer';

export const objectDescriptionEventBus = new EventBus();
export enum ObjectDescriptionEvent {
  openDescription = 'openDescription',
  closeDescription = 'closeDescription'
}

interface IState {
  descriptions?: Descriptions
  objectDescription?: ProcessorObject,
  tabs?: Tabs,
  targetTab: TabValue,
  isTabsLoading: boolean,
  period?: IDashiTableRow
}

const signMaster: {[key: number]: number} = {
  1: 3,
  2: 6,
  3: 4,
  4: 2,
  5: 1,
  6: 4,
  7: 6,
  8: 3,
  9: 5,
  10: 7,
  11: 7,
  12: 5
};

const getMasterConnectionForSign = async (masterSign: number, currentHouse: number) => {
  if (!masterSign || !currentHouse) {
    return;
  }

  return await getHouseMasterConnection(masterSign, currentHouse);
};

const getMasterConnectionsForPlanet = async (planet: number, currentHouse: number, targetDegreeTable: DegreeTableItem): Promise<MasterConnection []> => {
  if (!planet || !currentHouse || !masterSigns[planet]) {
    return [];
  }

  const signs: Array<number> = masterSigns[planet];
  const connections = await Promise.all(
    signs.map(async (sign) => {
      const degreeTableRow = targetDegreeTable.table.primaryData.find((degreeTableItem) => {
        return degreeTableItem.sign === sign;
      }) as DegreeTableRow;

      if (degreeTableRow) {
        return {
          house: degreeTableRow.house,
          currentHouse,
          connection: await getHouseMasterConnection(degreeTableRow.house, currentHouse)
        };
      }
    })
  );

  return connections
    .map((connection) => {
      if (!connection) {
        return connection;
      }

      return {
        planet,
        currentHouse: connection.connection?.house,
        masterForHouse: connection.connection?.planet,
        description: connection.connection?.description
      };
    })
    .filter((connection) => !!connection) as MasterConnection [];
};

const masterSigns = Object.entries(signMaster).reduce((prev, [sign, master]) => {
  if (prev[master]) {
    prev[master].push(Number(sign));

    return prev;
  }

  return {
    ...prev,
    [Number(master)]: [Number(sign)]
  };
}, {} as any);

const findPlanet = (planetId: number, tableParts: DegreeTableParts): DegreeTableRow | undefined => {
  for (const tablePart of Object.values(tableParts)) {
    for (const tablePartItem of tablePart) {
      if (tablePartItem.planet.id === Number(planetId)) {
        return tablePartItem;
      }
    }
  }
};

const initialTabs = {
  [TabValue.Desc]: 'Трактовка',
  [TabValue.PlanetInHouse]: 'Планета в доме',
  [TabValue.PlanetInSign]: 'Планета в знаке',
  [TabValue.DeepSky]: 'Соединение DeepSky',
  [TabValue.HouseMaster]: 'Управитель Дома',
  [TabValue.Naksatra]: 'Накшатра'
};

const houseTabs = {
  [TabValue.Desc]: 'Трактовка',
  [TabValue.HouseMaster]: 'Управитель Дома',
  [TabValue.HouseCupside]: 'Купсид Дома'
};

const initialState: IState = {
  objectDescription: undefined,
  descriptions: undefined,
  tabs: { [TabValue.Desc]: 'Трактовка' },
  targetTab: TabValue.Desc,
  isTabsLoading: false,
  period: undefined
};

const initDataHouse = async (house: number, targetHouse: number): Promise<Descriptions> => {
  const houseDescs = {
    [TabValue.Desc]: undefined,
    [TabValue.HouseMaster]: {
      isLoading: false,
      masterDescription: await getMasterConnectionForSign(house, targetHouse)
    },
    [TabValue.HouseCupside]: undefined
  } as any;

  return houseDescs;
};

const initDataPlanet = async (object: ProcessorObject, sign: number = 1, house: number = 1, degreeTableItem: DegreeTableItem, naksatra: ProcessorObject | undefined = undefined): Promise<Descriptions> => {
  const descs = {
    [TabValue.Desc]: object.description,
    [TabValue.PlanetInHouse]: undefined,
    [TabValue.PlanetInSign]: undefined,
    [TabValue.DeepSky]: {
      isLoading: true,
      deepSkyObjects: [],
      description: ''
    },
    [TabValue.HouseMaster]: undefined,
    [TabValue.Naksatra]: naksatra
  } as any;
  const [planetInHouse, planetInSign, masterDescription] = await Promise.all([
    getPlanetHouseConnection(object.internalId, house),
    getPlanetSignConnection(object.internalId, sign),
    getMasterConnectionsForPlanet(object.internalId, house, degreeTableItem)
  ]);

  descs[TabValue.PlanetInHouse] = planetInHouse?.description;
  descs[TabValue.PlanetInSign] = planetInSign?.description;
  descs[TabValue.HouseMaster] = {
    isLoading: false,
    masterDescription
  };

  return descs;
};

interface DeepSkyParams {
  planetId: number
}

export const initDeepSkyObjects = createAsyncThunk(
  'objectDescription/initDeepSky',
  async ({ planetId }: DeepSkyParams, thunkAPI) => {
    const store: any = await thunkAPI.getState();
    
    const isVarshapkhalaActive = store.horoscopes.targetRoute?.value === '/processor/horoscopes/varshapkhala' 
      && !store.varshpahala.isYearPickerActive;
    
    const degreeTable = isVarshapkhalaActive
      ? store.varshpahala.varshpahalaDegreeTable as DegreeTable
      : store.horoscopes.degreeTable as DegreeTable;
    const tableName = store.horoscopes.targetMapValue;
    const date = isVarshapkhalaActive
      ? store.varshpahala.varshpahalaDate
      : store.horoscopes.horoscopeUserInfo.date;

    const newDeepSkyObjects = await getDeepSky()
      .then((deepSkyObjects) => {
        const degreeMapIndex = degreeTable.findIndex((degreeTableItem) => degreeTableItem.tableName === tableName);
        const result = countDeepSky(deepSkyObjects, degreeTable, date, tableName);

        if (isVarshapkhalaActive) {
          thunkAPI.dispatch(setVarshpahalaDegreeTable(result.degreeTable));
        }

        return result.degreeTable[degreeMapIndex].table.primaryData.find((row) => (row.planet.id ?? -1) === planetId)?.deepSkyObjects || [];
      });

    return {
      deepSkyObjects: newDeepSkyObjects
    };
  }
);

interface ObjectDescriptionParams {
  object: ProcessorObject,
}

export const initObjectDescription = createAsyncThunk(
  'objectDescription/init',
  async (params: ObjectDescriptionParams, thunkAPI) => {
    const store: any = await thunkAPI.getState();
    
    const isVarshapkhalaActive = store.horoscopes.targetRoute?.value === '/processor/horoscopes/varshapkhala' 
      && !store.varshpahala.isYearPickerActive;
    
    const degreeTable = isVarshapkhalaActive 
      ? store.varshpahala.varshpahalaDegreeTable as DegreeTable
      : store.horoscopes.degreeTable as DegreeTable;
    
    const tableName = store.horoscopes.targetMapValue;
    const degreeMapIndex = degreeTable.findIndex((degreeTableItem) => degreeTableItem.tableName === tableName);
    const nakstaras = store.horoscopes.processorObjects[ProcessorObjectType.Nakshatra];
    let descriptions: Descriptions;
    let tabs: Tabs;
    let period: IDashiTableRow | undefined;

    if (params.object.typeId === ProcessorObjectType.House) {
      tabs = houseTabs;
      const { sign, house } = params.object.house as any;

      const masterHouse = signMaster[sign] as number;
      descriptions = await initDataHouse(house, findPlanet(masterHouse, degreeTable[degreeMapIndex].table)?.house as number);
    } else {
      const planet = findPlanet(params.object.internalId, degreeTable[degreeMapIndex].table);
      const sign = planet?.sign;
      const house = planet?.house;
      const nakstara = nakstaras[planet?.naksantra?.id as number];
      
      const dashiTable = isVarshapkhalaActive 
        ? { table: store.varshpahala.dashiTable }
        : store.horoscopes.dashiVim;
      
      // eslint-disable-next-line no-labels
      flag: for (const dashiTableItem of dashiTable.table) {
        for (const item of dashiTableItem.subTable) {
          if (!item.planets.includes(planet?.planet.name as string) && item.planet !== planet?.planet.name as string) {
            continue;
          }

          const now = moment();
          const dateStart = moment(item.dateStart, 'DD.MM.YYYY');
          const dateEnd = moment(item.dateEnd, 'DD.MM.YYYY');

          if (now > dateEnd) {
            continue;
          }

          if (dateStart >= now || now >= dateStart && dateEnd >= now) {
            period = item;
            // eslint-disable-next-line no-labels
            break flag;
          }
        }
      };

      tabs = initialTabs;
      descriptions = await initDataPlanet(params.object, sign, house, degreeTable[degreeMapIndex], nakstara);
    }

    thunkAPI.dispatch(initDeepSkyObjects({ planetId: params.object.internalId }));

    console.log({
      descriptions,
      tabs,
      period
    });

    return {
      descriptions,
      tabs,
      period
    };
  }
);

export const ObjectDescriptionSlice = createSlice({
  name: 'objectDescription',
  initialState,
  reducers: {
    closeDescription: () => initialState,
    setObjectDescription: (state, action) => {
      state.objectDescription = action.payload;
    },
    openTab: (state, action) => {
      state.targetTab = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initObjectDescription.pending, (state) => {
        state.isTabsLoading = true;
      })
      .addCase(initObjectDescription.fulfilled, (state, action: PayloadAction<{
        descriptions: Descriptions
        tabs: Tabs,
        period?: IDashiTableRow
      }>) => {
        state.period = action.payload.period;
        state.descriptions = {
          ...state.descriptions,
          ...action.payload.descriptions
        };
        state.tabs = action.payload.tabs;
        state.isTabsLoading = false;
      });
    builder
      .addCase(initDeepSkyObjects.fulfilled, (state, action: PayloadAction<{
        deepSkyObjects: CurrentDeepSkyObject[];
      }>) => {
        if (state.descriptions) {
          const newDescs = { ...state.descriptions };
          newDescs[TabValue.DeepSky] = {
            isLoading: false,
            deepSkyObjects: action.payload.deepSkyObjects || []
          };
          state.descriptions = newDescs;
        }
      });
  }
});

export const { closeDescription, openTab, setObjectDescription } = ObjectDescriptionSlice.actions;
export default ObjectDescriptionSlice.reducer;
