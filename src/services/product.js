const db = require("../helpers/db");
const { getTenantSpecificRelation } = require("../utils");
const {
  PRODUCTS,
  PRODUCTS_IMAGES,
} = require("../constants/tenantSpecificRelations");
const { CATEGORIES } = require("../constants/publicRelations");
const sql = require("../config/db");

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
      uploadedImages = [],
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
    const test = await sql.begin(async (sql) => {
      const result = await db.createInTransaction(
        sql,
        productRelation,
        newProductData
      );

      let images = [];
      console.log({ uploadedImages });
      if (uploadedImages.length > 0) {
        const productImagesRelation = getTenantSpecificRelation(
          shopId,
          PRODUCTS_IMAGES
        );
        const addProductImagesPromises = uploadedImages.map((image) => {
          return db.createInTransaction(sql, productImagesRelation, {
            product_id: result.id,
            uploaded_image_public_id: image.publicId,
            url: image.url,
          });
        });

        images = await Promise.all(addProductImagesPromises);
      }
      result.images = images;
      return result;
    });

    return test;
  },

  findByShopId: async (shopId, filter) => {
    const result = await db.find(getTenantSpecificRelation(shopId, PRODUCTS));
    // TODO: use Redis to cache the category
    const categoryMapping = new Map();
    for (let i = 0; i < result.length; i++) {
      const product = result[i];
      const categoryQuery = db.findById(CATEGORIES, product.category_id);
      let category;
      if (categoryMapping.has(product.category_id)) {
        category = categoryMapping.get(product.category_id);
      } else {
        category = await categoryQuery;
        categoryMapping.set(product.category_id, category);
      }
      product.category = category;

      const productImages = await sql`SELECT * FROM ${sql(
        getTenantSpecificRelation(shopId, PRODUCTS_IMAGES)
      )} WHERE product_id = ${product.id};`;
      console.log({ productImages });
      product.images = productImages;
    }
    return result;
  },

  findById: async (shopId, productId) => {
    const result = await db.findById(
      getTenantSpecificRelation(shopId, PRODUCTS),
      productId
    );
    const productImages = await sql`SELECT * FROM ${sql(
      getTenantSpecificRelation(shopId, PRODUCTS_IMAGES)
    )} WHERE product_id = ${productId};`;

    result.images = productImages;
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
