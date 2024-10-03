const sql = require("../config/db");
const { ONLINE_SHOP_PAGES } = require("../constants/tenantSpecificRelations");
const db = require("../helpers/db");
const { getTenantSpecificRelation } = require("../utils");

const onlineShopService = {
  getPages: async (shopId) => {
    const pages = await sql`SELECT id, name FROM ${sql(
      getTenantSpecificRelation(shopId, ONLINE_SHOP_PAGES)
    )};`;

    return pages;
  },

  getPageLayout: async (shopId, pageId) => {
    const page = await sql`SELECT layout FROM ${sql(
      getTenantSpecificRelation(shopId, ONLINE_SHOP_PAGES)
    )} WHERE id = ${pageId};`;

    return page[0];
  },

  createPage: async (shopId, { name, layout = "" }) => {
    const page = {
      name,
      layout,
    };

    const result = await db.create(
      getTenantSpecificRelation(shopId, ONLINE_SHOP_PAGES),
      page
    );

    return result;
  },

  updatePage: async (shopId, pageId, updatedData) => {
    const result = await db.updateById(
      getTenantSpecificRelation(shopId, ONLINE_SHOP_PAGES),
      pageId,
      updatedData
    );

    return result;
  },

  findByIdIfExist: async (shopId, pageId) => {
    const page = await db.findByIdIfExist(
      getTenantSpecificRelation(shopId, ONLINE_SHOP_PAGES),
      pageId
    );

    return page;
  },
};

module.exports = onlineShopService;
