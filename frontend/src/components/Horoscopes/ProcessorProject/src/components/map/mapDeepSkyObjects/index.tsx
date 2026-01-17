import React, { useMemo } from 'react';
import DeepSkyObject from '../../deepSkyObject/DeepSkyObject';
import { MapDeepSkyObject } from '../../../models/types/MapDeepSkyObject';
import { StellarObjectType } from '../../../models/enums/StellarObjectType';

interface MapDeepSkyObjectProps {
  deepSkyObjects?: MapDeepSkyObject [],
}

const Index = ({ deepSkyObjects }: MapDeepSkyObjectProps) => {
  const filteredDeepSlyObjects = useMemo(() => {
    let galaxyCounter = 0;
    let nebulaCounter = 0;
    let startsCounter = 0;

    return deepSkyObjects?.filter((object) => {
      if (object.stellarObjectType === StellarObjectType.Nebula) {
        nebulaCounter += 1;

        return nebulaCounter === 1;
      }

      if (object.stellarObjectType === StellarObjectType.Galaxy) {
        galaxyCounter += 1;

        return galaxyCounter === 1;
      }

      if (object.stellarObjectType === StellarObjectType.Stars) {
        startsCounter += 1;

        return startsCounter === 1;
      }

      return true;
    });
  }, [deepSkyObjects]);

  return (
    <>
      {!!deepSkyObjects?.length && <>
        {filteredDeepSlyObjects?.map((deepSkyObject, index) => (
          <DeepSkyObject key={index} deepSkyObject={deepSkyObject} />
        ))}
      </>}
    </>
  );
};

export default Index;
