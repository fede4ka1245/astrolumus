export const getFormattedGreenwich = (greenwich: string | undefined) => {
  if (!greenwich) {
    return '';
  }

  if (greenwich.toLowerCase() === 'восток') {
    return '';
  } else if (greenwich.toLowerCase() === 'запад') {
    return '-';
  } else {
    return greenwich;
  }
};
