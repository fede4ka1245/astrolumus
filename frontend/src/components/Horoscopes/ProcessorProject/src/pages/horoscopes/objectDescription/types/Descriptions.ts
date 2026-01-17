import { TabValue } from './Tabs';
import { CurrentDeepSkyObject } from '../../../../models/types/CurrentDeepSkyObject';
import { MasterConnection } from './MasterConnection';

export interface Description {
  isLoading?: boolean,
  description?: string,
  deepSkyObjects?: CurrentDeepSkyObject [],
  masterDescription?: MasterConnection [] | MasterConnection,
}

export type DescriptionObject = Description | string;

export type Descriptions = {
  [key in TabValue]?: DescriptionObject;
};
