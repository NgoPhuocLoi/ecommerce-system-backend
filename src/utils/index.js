const getSchemaNameFromAccountId = (shopId) => shopId.replace(/-/g, "_");

const getTenantSpecificRelation = (shopId, relationName) =>
  `${getSchemaNameFromAccountId(shopId)}.${relationName}`;

const getShopIdFromRequest = (req) => req.headers["x-shop-id"];

const convertFromCamelToSnakeCase = (camelString) => {
  return camelString.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
};

const convertToObjectWithSnakeCase = (input) => {
  const result = {};
  for (let key of Object.keys(input)) {
    result[convertFromCamelToSnakeCase(key)] = input[key];
  }

  return result;
};

module.exports = {
  getSchemaNameFromAccountId,
  getTenantSpecificRelation,
  getShopIdFromRequest,
  convertToObjectWithSnakeCase,
  convertFromCamelToSnakeCase,
};
