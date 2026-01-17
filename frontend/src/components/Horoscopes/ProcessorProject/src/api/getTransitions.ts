import { TransitionsTableRow } from '../models/types/TransitionsTableRow';
import { TransitionsPlanet } from '../models/types/transitions/transitionsPlanet';
import processorRequest, { getProcessorProxyUrl } from './processorRequest';
import { getZodiacSignById } from '../helpers/getZodiacSignById';

interface getTransitionsProps {
  dateStart: string,
  dateTo: string,
  planets: TransitionsPlanet [],
  condition: string,
  isRasiMerge: boolean,
  isMovementMerge: boolean,
}

export const getTransitions = async ({
  dateStart,
  dateTo,
  planets,
  isRasiMerge,
  isMovementMerge,
  condition
}: getTransitionsProps): Promise<TransitionsTableRow []> => {
  const params: any = {
    'dateFrom': dateStart,
    dateTo,
    operation: condition
  };

  const ignoredParams = [];

  if (isRasiMerge) {
    ignoredParams.push('signSequentialChange');
  }

  if (isMovementMerge) {
    ignoredParams.push('movementTypeChange');
  }
  
  ignoredParams.forEach((param, index) => {
    params[`ignore[${index}]`] = param;
  });

  planets.forEach((planet, index) => {
    params[`conditions[${index}][bodyId]`] = planet.planet;
    params[`conditions[${index}][degreeRange][0]`] = planet.min;
    params[`conditions[${index}][degreeRange][1]`] = planet.max;
    params[`conditions[${index}][movementType]`] = planet.direction;

    if (planet.position.type === 'sign') {
      params[`conditions[${index}][signId]`] = planet.position.id;
    } else if (planet.position.type === 'nakshatra') {
      params[`conditions[${index}][nakshatraId]`] = planet.position.id;
    } else if (planet.position.type === 'body') {
      params[`conditions[${index}][withBodyId]`] = planet.position.id;
    }
  });

  const { data } = await processorRequest.get(`${getProcessorProxyUrl()}/gochara`, {
    params
  });

  return [...data.data.map((item: any) => ({
    dateStart: item?.startDate,
    dateEnd: item?.endDate,
    signs: item.transits.map((transit: any) => ({
      motionType: `(${transit.movementType.toUpperCase()})`,
      sign: getZodiacSignById(transit.signId)
    })),
    endDateLessThanActual: item?.endDateLessThanActual
  }))];
};
