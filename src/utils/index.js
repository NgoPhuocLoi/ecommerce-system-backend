const getSchemaNameFromAccountId = (accountId) => accountId.replace(/-/g, "_");

const getTenantSpecificRelation = (accountId, relationName) =>
  `${getSchemaNameFromAccountId(accountId)}.${relationName}`;

module.exports = {
  getSchemaNameFromAccountId,
  getTenantSpecificRelation,
};
