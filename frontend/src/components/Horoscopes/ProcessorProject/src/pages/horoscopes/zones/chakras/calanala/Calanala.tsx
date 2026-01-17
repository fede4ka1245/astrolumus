import React from 'react';
import './Calanala.scss';
import Zone from '../../components/zone/Zone';
import { ChakraProps } from '../ChakraProps';

const Calanala = ({ chakra }: ChakraProps) => {
  return (
    <section>
      <div className={'zones-calanala'}>
        <svg className={'image'} viewBox="0 0 288 218" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M286 86L11 86" stroke="white" strokeWidth="2"/>
          <path d="M76.5038 85.9999L15.2768 24.7728" stroke="white" strokeWidth="2"/>
          <path d="M213.277 85.9999L274.504 24.7728" stroke="white" strokeWidth="2"/>
          <path d="M76.5039 137.773L31 183.277" stroke="white" strokeWidth="2"/>
          <path d="M213 137.773L258.504 183.277" stroke="white" strokeWidth="2"/>
          <path d="M286 111L11 111" stroke="white" strokeWidth="2"/>
          <path d="M286 136L11 136" stroke="white" strokeWidth="2"/>
          <path d="M78 217.5L78 2.5" stroke="white" strokeWidth="2"/>
          <path d="M145 217.5L145 2.49999" stroke="white" strokeWidth="2"/>
          <path d="M212 217.5L212 2.49999" stroke="white" strokeWidth="2"/>
          <path d="M254.523 11.8847L254.234 12.1739V12.1739C245.607 20.801 245.607 34.7881 254.234 43.4152L254.812 43.9937C263.439 52.6208 277.427 52.6208 286.054 43.9937V43.9937L286.343 43.7045" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M57.3652 1.61487V2.02396V2.02396C57.3652 14.2244 67.2557 24.1149 79.4561 24.1149H80.2743C92.4748 24.1149 102.365 14.2244 102.365 2.02396V2.02396V1.61487" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M122.365 1.61487V2.02396V2.02396C122.365 14.2244 132.256 24.1149 144.456 24.1149H145.274C157.475 24.1149 167.365 14.2244 167.365 2.02396V2.02396V1.61487" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M187.365 1.61487V2.02396V2.02396C187.365 14.2244 197.256 24.1149 209.456 24.1149H210.274C222.475 24.1149 232.365 14.2244 232.365 2.02396V2.02396V1.61487" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M32.8206 11.8847L33.1098 12.1739V12.1739C41.7369 20.801 41.7369 34.7881 33.1098 43.4152L32.5313 43.9937C23.9043 52.6208 9.91707 52.6208 1.29003 43.9937V43.9937L1.00076 43.7045" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M254.523 215.73L254.234 215.44V215.44C245.607 206.813 245.607 192.826 254.234 184.199L254.812 183.621C263.439 174.994 277.427 174.994 286.054 183.621V183.621L286.343 183.91" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M32.8206 215.73L33.1098 215.44V215.44C41.7369 206.813 41.7369 192.826 33.1098 184.199L32.5313 183.621C23.9043 174.994 9.91707 174.994 1.29003 183.621V183.621L1.00076 183.91" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        {chakra?.map((calanalaItem, index) => (
          <div className={`section-${index + 1} section`} key={index}>
            <Zone value={calanalaItem?.value} tip={calanalaItem.tip} color={calanalaItem.color === 'green' ? '#49BC5B' : '#FFA8A8'}/>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Calanala;
