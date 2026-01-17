import { DeepSkyYear } from './DeepSkyYear';
import { StellarObjectType } from '../enums/StellarObjectType';

export interface DeepSkyObject {
  id: number,
  years: DeepSkyYear [],
  title: string,
  constellation: string,
  comment: string,
  stellarObjectType: StellarObjectType,
  imageUrl?: string,
  area: string,
  img?: any
}
