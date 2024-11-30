const getSchemaNameFromAccountId = (shopId) => shopId.replace(/-/g, "_");

const getTenantSpecificRelation = (shopId, relationName) =>
  `${getSchemaNameFromAccountId(shopId)}.${relationName}`;

const getShopIdFromRequest = (req) => req.headers["x-shop-id"];

const convertFromCamelToSnakeCase = (camelString) => {
  return camelString.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
};

const convertFromSnakeToCamelCase = (snakeString) => {
  return snakeString.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );
};

const convertToObjectWithSnakeCase = (input) => {
  const result = {};
  for (let key of Object.keys(input)) {
    result[convertFromCamelToSnakeCase(key)] = input[key];
  }

  return result;
};

const convertToObjectWithCamelCase = (input) => {
  const result = {};
  for (let key of Object.keys(input)) {
    result[convertFromSnakeToCamelCase(key)] = input[key];
  }

  return result;
};

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = {
  getSchemaNameFromAccountId,
  getTenantSpecificRelation,
  getShopIdFromRequest,
  convertToObjectWithSnakeCase,
  convertFromCamelToSnakeCase,
  convertFromSnakeToCamelCase,
  convertToObjectWithCamelCase,
  sortObject,
};
