import { FC } from 'react';

interface IProps {
  width: number | string;
  height: number | string;
  avatar: string | null;
  abbreviation: string;
  fontSize: number | string;
}

const Avatar: FC <IProps> = ({ width, height, avatar, abbreviation, fontSize }) => {
  if (avatar) {
    return (
      <img 
        style={{
          width,
          height,
          borderRadius: '50%',
          backgroundColor: '#C3C9CD',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#FFFFFF'
        }} alt="avatar" src={avatar}/> 
    );
  }

  return (
    <div 
      style={{
        width,
        height,
        borderRadius: '50%',
        backgroundColor: '#C3C9CD',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize,
        fontFamily: 'Playfair Display',
        color: '#FFFFFF'
      }}>
      {abbreviation}
    </div>
  );
};

export default Avatar;
