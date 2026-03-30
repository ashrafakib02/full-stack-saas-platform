export const groupToObject = (data, key) => {
  return data.reduce((acc, item) => {
    acc[item[key]] = item._count;
    return acc;
  }, {});
};