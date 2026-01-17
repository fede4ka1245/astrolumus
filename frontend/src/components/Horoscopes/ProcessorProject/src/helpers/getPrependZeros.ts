const getPrependZeros = (number: number): string => {
  if (number < 10 && number >= 0) {
    return `0${number}`;
  } 

  return number.toString();
};

export default getPrependZeros;
