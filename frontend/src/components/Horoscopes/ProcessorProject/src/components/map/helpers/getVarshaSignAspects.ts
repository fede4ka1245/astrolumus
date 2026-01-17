export const getVarshaSignAspects = (targetAspectIndex: number) => {
  const positive = [
    [3, 5, 9, 11],
    [4, 6, 10, 12],
    [5, 7, 11, 1],
    [6, 8, 12, 2],
    [7, 9, 1, 3],
    [8, 10, 2, 4],
    [9, 11, 3, 5],
    [10, 12, 4, 6],
    [11, 1, 5, 7],
    [12, 2, 6, 8],
    [1, 3, 7, 9],
    [2, 4, 8, 10]
  ];

  const negative = [
    [1, 4, 7, 10],
    [2, 5, 8, 11],
    [3, 6, 9, 12],
    [4, 7, 10, 1],
    [5, 8, 11, 2],
    [6, 9, 12, 3],
    [7, 10, 1, 4],
    [8, 11, 2, 5],
    [9, 12, 3, 6],
    [10, 1, 4, 7],
    [11, 2, 5, 8],
    [12, 3, 6, 9]
  ];

  return {
    positiveAspects: positive[targetAspectIndex - 1],
    negativeAspects: negative[targetAspectIndex - 1]
  };
};
