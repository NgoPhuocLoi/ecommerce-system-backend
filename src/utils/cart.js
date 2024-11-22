const transformList = (list) => {
  const result = {};

  list.forEach((item) => {
    const { id, name, ...rest } = item;
    if (!result[id]) {
      result[id] = { id, ...rest, attributeValues: [] };
    }
    result[id].attributeValues.push(name);
  });

  return Object.values(result);
};

module.exports = {
  transformList,
};
