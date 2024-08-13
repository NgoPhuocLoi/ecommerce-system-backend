const db = require("../helpers/db");
const { getTenantSpecificRelation } = require("../utils");
const { PRODUCTS } = require("../constants/tenantSpecificRelations");

const productService = {
  create: async (
    shopId,
    {
      categoryId,
      description = null,
      name,
      isActive = true,
      price,
      compareAtPrice,
      cost,
      availableQuantity = 0,
      incomingQuantity = 0,
      soldNumber = 0,
      customProductTypeId = null,
    }
  ) => {
    const newProductData = {
      category_id: categoryId,
      name,
      description,
      is_active: isActive,
      cost,
      price,
      compare_at_price: compareAtPrice,
      available_quantity: availableQuantity,
      incoming_quantity: incomingQuantity,
      sold_number: soldNumber,
      custom_product_type_id: customProductTypeId,
    };
    const productRelation = getTenantSpecificRelation(shopId, PRODUCTS);
    const result = await db.create(productRelation, newProductData);
    return result;
  },

  findByShopId: async (shopId, filter) => {
    const result = await db.find(getTenantSpecificRelation(shopId, PRODUCTS));
    return result;
  },

  findById: async (shopId, productId) => {
    const result = await db.findById(
      getTenantSpecificRelation(shopId, PRODUCTS),
      productId
    );
    return result;
  },

  updateById: async (shopId, productId, updatedData) => {
    const result = await db.updateById(
      getTenantSpecificRelation(shopId, PRODUCTS),
      productId,
      updatedData
    );

    return result;
  },

  deleteById: async (shopId, productId) => {
    const result = await db.deleteById(
      getTenantSpecificRelation(shopId, PRODUCTS),
      productId
    );

    return result;
  },
};

module.exports = productService;
