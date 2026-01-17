import React from 'react';
import reply from './assets/reply.svg';
import share from './assets/share.svg';
import bin from './assets/bin.svg';

const MessageEditor = () => {
  return (
    <div style={{ width: '50%', height: '100%', marginLeft: 'auto', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
      <img alt='reply' src={reply} width={'25px'} height={'25px'}/>
      <img alt='share' src={share} width={'25px'} height={'25px'}/>
      <img alt='bin' src={bin} width={'25px'} height={'25px'}/>
    </div>
  );
};

export default MessageEditor;
