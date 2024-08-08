const sql = require("../config/db");
const prisma = require("../config/prismaClient");
const {
  getSchemaNameFromAccountId,
  getTenantSpecificRelation,
} = require("../utils");
const { v4 } = require("uuid");
const db = require("../helpers/db");
const { SHOPS } = require("../constants/tenantSpecificRelations");

const shopService = {
  create: async ({ accountId, name }) => {
    const newShop = {
      id: v4(),
      name,
      account_id: accountId,
      updated_at: new Date(),
    };

    const relation = getTenantSpecificRelation(accountId, SHOPS);
    const result = await db.create(relation, newShop);

    return result;
  },

  getByAccountId: async ({ accountId }) => {
    const relation = getTenantSpecificRelation(accountId, SHOPS);

    const result = await sql`select * from ${sql(relation)}`;

    return result;
  },

  getShopById: async ({ accountId, shopId }) => {
    const relation = getTenantSpecificRelation(accountId, SHOPS);

    const result = await sql`select * from ${sql(
      relation
    )} where id = ${shopId}`;

    return result[0];
  },
};

module.exports = shopService;
