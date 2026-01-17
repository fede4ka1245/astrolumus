import { useCallback, FC } from 'react';
import { Grid, Typography } from '@mui/material';
import menu from '../../pages/forum/assets/menu.svg';
import search from '../../pages/forum/assets/search.svg';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../models/enums/routes';
import IconButton from '../iconButton/IconButton';
import { processorRoutes } from '../../pages/astrlogicalProcessor/processorRoutes';
import { useIsPaymentsEnabled } from '../../hooks/useIsPaymentsEnabled';

interface IProps {
  page: string;
  content?: any;
  onSearch?: () => void;
}

const PageHeader: FC<IProps> = ({ page, content, onSearch = () => {} }) => {
  const navigate = useNavigate();
  const isPaymentsEnabled = useIsPaymentsEnabled();

  const onMenuClick = useCallback(() => {
    navigate(routes.menu);
  }, [navigate]);

  const onWalletClick = () => {
    navigate(processorRoutes.rates);
  };

  const onSearchClick = () => {
    onSearch();
  };

  return (
    <div>
      <Grid container pl={2} pr={2} alignItems={'center'}>
        <Grid item pr={2} alignItems={'center'} display={'flex'}>
          <IconButton onClick={onMenuClick}>
            <img src={menu} width={30} height={30} />
          </IconButton>
        </Grid>
        <Grid item mr={'auto'}>
          <Typography fontFamily={'Gilroy'} fontWeight={700} fontSize={'17px'} color={'#37366B'}>
            {page}
          </Typography>
        </Grid>
        {
          content
            ? (
              <>
                {content}
              </>
            )
            : (
              <>
                {isPaymentsEnabled &&
                  <Grid item mr={3}>
                    <img src={'/assets/wallet-forum.svg'} onClick={onWalletClick} width={24} height={26}/>
                  </Grid>}
                <Grid item>
                  <img src={search} onClick={onSearchClick} width={23} height={23}/>
                </Grid>
              </>
            )
        }
      </Grid>
    </div>
  );
};

export default PageHeader;
