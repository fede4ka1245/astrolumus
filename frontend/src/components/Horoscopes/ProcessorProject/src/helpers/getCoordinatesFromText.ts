export const getCoordinatesFromText = (text: string) => {
  const [item, item2] = text.split(', ').slice(-2);
  const result: any = {};
  let longitude;
  let latitude;
  
  if (/[ns]/i.test(item)) {
    longitude = item2;
    latitude = item;
  } else {
    longitude = item;
    latitude = item2;
  }

  if (latitude.includes('n')) {
    result.latitude = latitude.replace(/[nwes]/gi, '.');
  } else {
    result.latitude = '-' + latitude.replace(/[nwes]/gi, '.');
  }

  if (longitude.includes('e')) {
    result.longitude = longitude.replace(/[nwes]/gi, '.');
  } else {
    result.longitude = '-' + longitude.replace(/[nwes]/gi, '.');
  }

  return result;
};
