import { FC } from 'react';
import Skeleton from '@mui/material/Skeleton';

const TariffSkeleton: FC = () => {
  return (
    <Skeleton
      variant="rectangular"
      style={{
        width: '100%',
        height: 140,
        borderRadius: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.6)'
      }}
    />
  );
};

export default TariffSkeleton;
