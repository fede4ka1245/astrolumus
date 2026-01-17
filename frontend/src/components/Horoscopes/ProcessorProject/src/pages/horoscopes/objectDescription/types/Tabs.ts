export enum TabValue {
  Desc,
  DeepSky,
  PlanetInSign,
  PlanetInHouse,
  HouseMaster,
  HouseCupside,
  Naksatra
}

export type Tabs = {
  [key in TabValue]?: string;
};
