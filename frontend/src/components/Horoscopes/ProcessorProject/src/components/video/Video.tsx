import { FC, useCallback, useMemo } from 'react';
import ReactPlayer from 'react-player';
import { IBootcamp } from '../../models/interfaces/advertising';
import styles from './styles.module.scss';
import { Grid } from '@mui/material';
import AspectRatio from '@mui/joy/AspectRatio';
import { FirebaseEvent } from '../../helpers/firebase/firebaseEvent';
import { logFirebaseEvent } from '../../helpers/firebase';
import { replaceDomainInUrl } from '../../helpers/replaceDomainsInContent';

interface IProps {
  video?: IBootcamp;
  titleColor?: string;
}

const Video: FC<IProps> = ({ video, titleColor }) => {
  // Обрабатываем все URL из видео
  const processedImageUrl = useMemo(() => {
    return video?.image ? replaceDomainInUrl(video.image) : '';
  }, [video?.image]);

  const processedImageLink = useMemo(() => {
    return video?.image_link ? replaceDomainInUrl(video.image_link) : '';
  }, [video?.image_link]);

  const processedVideoLink = useMemo(() => {
    return video?.video_link ? replaceDomainInUrl(video.video_link) : '';
  }, [video?.video_link]);

  const onImageClick = useCallback(() => {
    console.log(video);
    if (!processedImageLink) {
      return;
    }

    window.open(processedImageLink);
  }, [processedImageLink, video]);

  const onVideoClick = useCallback(() => {
    logFirebaseEvent({
      name: FirebaseEvent.onVideoClick
    });
  }, []);

  if (!video) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title} style={titleColor ? { color: titleColor } : {}}>
        <div className={styles.dot} style={titleColor ? { backgroundColor: titleColor } : {}}/>
        {video.title}
      </div>
      <div className={styles.wrapper}>
        {video.image && (
          <AspectRatio ratio={41 / 27}>
            <Grid position={'relative'} width={'100%'} height={'100%'} overflow={'hidden'} borderRadius={'20px'}>
              <img onClick={onImageClick} alt={'video'} src={processedImageUrl} className={styles.video_player}/>
              <img alt={'video'} src={processedImageUrl} className={styles.background}/>
            </Grid>
          </AspectRatio>
        )}
        {!video.image && (
          <AspectRatio ratio={16 / 9}>
            <div style={{ width: '100%' }}>
              <ReactPlayer
                className={styles.video_player}
                url={processedVideoLink}
                width='100%'
                onPlay={onVideoClick}
                height='100%'
              />
            </div>
          </AspectRatio>
        )}
      </div>
    </div>
  );
};

export default Video;
