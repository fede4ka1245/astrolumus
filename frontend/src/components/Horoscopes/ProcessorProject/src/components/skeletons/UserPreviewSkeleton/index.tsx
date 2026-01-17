import { FC } from 'react';
import Skeleton from '@mui/material/Skeleton';

const UserPreviewSkeleton: FC = () => {
  return (
    <Skeleton
      variant="rectangular"
      style={{
        width: '100%',
        height: 60,
        borderRadius: 10
      }}
    />
  );
};

export default UserPreviewSkeleton;
