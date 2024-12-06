const sql = require("../config/db");
const {
  ONLINE_SHOP_PAGES,
  ONLINE_SHOPS,
} = require("../constants/tenantSpecificRelations");
const db = require("../helpers/db");
const {
  getTenantSpecificRelation,
  convertToObjectWithCamelCase,
} = require("../utils");

const onlineShopService = {
  getPages: async (shopId) => {
    const pages =
      await sql`SELECT id, name, show_in_navigation, position, created_by_default, link FROM ${sql(
        getTenantSpecificRelation(shopId, ONLINE_SHOP_PAGES)
      )} ORDER BY position;`;

    return pages.map(convertToObjectWithCamelCase);
  },

  getOnlineShop: async (shopId) => {
    const shop =
      await sql`SELECT domain from public.shops WHERE id = ${shopId};`;
    const onlineShops = await db.find(
      getTenantSpecificRelation(shopId, ONLINE_SHOPS)
    );

    return onlineShops.map((oShop) => ({
      ...convertToObjectWithCamelCase(oShop),
      domain: shop[0]?.domain,
    }));
  },

  getPageLayout: async (shopId, pageId) => {
    const page = await sql`SELECT layout FROM ${sql(
      getTenantSpecificRelation(shopId, ONLINE_SHOP_PAGES)
    )} WHERE id = ${pageId};`;

    return page[0];
  },

  createPage: async (
    shopId,
    { name, layout = "", showInNavigation = true, link, position }
  ) => {
    const page = {
      name,
      layout,
      showInNavigation,
      link,
      position,
      createdByDefault: false,
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

  updateDefaultLayout: async (shopId, updatedData) => {
    const result = await sql`UPDATE ${sql(
      getTenantSpecificRelation(shopId, ONLINE_SHOPS)
    )} SET ${sql(updatedData)} RETURNING *;`;

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
