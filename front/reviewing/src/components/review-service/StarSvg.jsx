import React from 'react';

const StarSvg = ({ isGold }) => {
  return (
    <svg
      width='24'
      height='24'
      fill={isGold ? 'gold' : 'lightgray'}
      viewBox='0 0 24 24'
    >
      <path d='M12 .587l3.668 7.568L24 9.423l-6 5.847L19.335 24 12 20.013 4.665 24 6 15.27 0 9.423l8.332-1.268z' />
    </svg>
  );
};

export default StarSvg;
