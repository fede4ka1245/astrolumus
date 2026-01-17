export const getSignAspects = (targetAspectIndex: number) => {
  const aspects = [
    [5, 8, 11],
    [4, 7, 10],
    [6, 9, 12],
    [2, 8, 11],
    [1, 7, 10],
    [3, 9, 12],
    [2, 5, 11],
    [1, 4, 10],
    [3, 6, 12],
    [2, 5, 8],
    [1, 4, 7],
    [3, 6, 9]
  ];

  return {
    positiveAspects: aspects[targetAspectIndex - 1],
    negativeAspects: [targetAspectIndex]
  };
};
