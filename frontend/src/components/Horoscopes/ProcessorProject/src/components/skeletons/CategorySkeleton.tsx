import Skeleton from '@mui/material/Skeleton';

const CategorySkeleton = () => {
  return (
    <Skeleton variant="rectangular" width={'100%'} height={47} style={{
      borderRadius: 10
    }}/>
  );
};

export default CategorySkeleton;
