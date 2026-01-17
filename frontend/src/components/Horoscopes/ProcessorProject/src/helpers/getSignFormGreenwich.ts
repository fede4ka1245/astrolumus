export const getSignFormGreenwich = (greenwich: string) => {
  if (greenwich.toLowerCase() === 'восток') {
    return '+';
  } else {
    return '-';
  }
};
