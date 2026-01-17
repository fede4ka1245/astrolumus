import { Planet } from './Planet';

export interface MapSection {
  house: number,
  signId: number
  arudhs: Planet [],
  aspects: Planet [],
  mandyGulika: Planet [],
  primaryData: Planet [],
  specialLagna: Planet [],
  transsaturns: Planet [],
  upagraha: Planet []
}
