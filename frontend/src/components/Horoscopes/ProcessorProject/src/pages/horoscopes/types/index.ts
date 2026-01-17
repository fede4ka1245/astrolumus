export enum ProcessorObjectType {
  Sign = 1,
  Nakshatra,
  Planet,
  Karaka,
  Arudhs,
  House
}

export interface ProcessorObject {
  id: number,
  name: string,
  internalId: number,
  description: string,
  house?: {
    house: number,
    sign: number
  }
  typeId: ProcessorObjectType
}

export interface ProcessorObjectMapItem {
  [key: number]: ProcessorObject
}

export interface ProcessorObjectMap {
  [ProcessorObjectType.House]: ProcessorObjectMapItem,
  [ProcessorObjectType.Karaka]: ProcessorObjectMapItem,
  [ProcessorObjectType.Planet]: ProcessorObjectMapItem,
  [ProcessorObjectType.Sign]: ProcessorObjectMapItem,
  [ProcessorObjectType.Nakshatra]: ProcessorObjectMapItem,
  [ProcessorObjectType.Arudhs]: ProcessorObjectMapItem,
}
