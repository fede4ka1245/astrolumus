import { FC } from 'react';
import Skeleton from '@mui/material/Skeleton';

const TopicSkeleton: FC = () => {
  return (
    <Skeleton
      variant="rectangular"
      style={{
        width: '100%',
        height: 110,
        borderRadius: 10
      }}
    />
  );
};

export default TopicSkeleton;
