const db = require("../helpers/db");
const { getTenantSpecificRelation } = require("../utils");
const {
  PRODUCTS,
  PRODUCTS_IMAGES,
  PRODUCT_ATTRIBUTES,
  ATTRIBUTE_VALUES,
  VARIANT_HAS_OPTION_WITH_VALUE,
  PRODUCT_VARIANTS,
  UPLOADED_IMAGES,
} = require("../constants/tenantSpecificRelations");
const { CATEGORIES } = require("../constants/publicRelations");
const sql = require("../config/db");
const { NotFound } = require("../responses/error");

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
      uploadedImageIds = [],
      attributes = [],
      variants = [],
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

      if (uploadedImageIds.length > 0) {
        await db.createInTransaction(
          sql,
          getTenantSpecificRelation(shopId, PRODUCTS_IMAGES),
          uploadedImageIds.map((imageId) => ({
            product_id: result.id,
            uploaded_image_id: imageId,
          }))
        );
      }
      result.images = images;
      const attributeIdMapping = new Map();
      const valueIdMapping = new Map();
      if (attributes.length > 0) {
        const productAttributesRelation = getTenantSpecificRelation(
          shopId,
          PRODUCT_ATTRIBUTES
        );

        const attributeValuesRelation = getTenantSpecificRelation(
          shopId,
          ATTRIBUTE_VALUES
        );

        for (let attribute of attributes) {
          const savedAttribute = await db.createInTransaction(
            sql,
            productAttributesRelation,
            {
              product_id: result.id,
              name: attribute.name,
              recommend_attribute_id: attribute.isRecommend
                ? Number(attribute.id)
                : null,
            }
          );
          attributeIdMapping.set(attribute.id, savedAttribute.id);
          console.log({ savedAttribute });
          const savedValues = await db.createInTransaction(
            sql,
            attributeValuesRelation,
            attribute.values.map((value) => ({
              attribute_id: savedAttribute.id,
              name: value.name,
              recommend_attribute_value_id: attribute.isRecommend
                ? Number(value.id)
                : null,
            }))
          );
          savedValues.forEach((value, index) => {
            valueIdMapping.set(attribute.values[index].id, value.id);
          });
        }
        console.log(attributeIdMapping);
        console.log(valueIdMapping);
      }

      if (variants.length > 0) {
        const productVariantsRelation = getTenantSpecificRelation(
          shopId,
          PRODUCT_VARIANTS
        );

        for (let variant of variants) {
          const savedVariant = await db.createInTransaction(
            sql,
            productVariantsRelation,
            {
              product_id: result.id,
              price: Number(variant.price),
              compare_at_price: result.compare_at_price,
              available_quantity: Number(variant.quantity),
              incoming_quantity: result.incoming_quantity,
              sold_number: result.sold_number,
            }
          );

          await db.createInTransaction(
            sql,
            getTenantSpecificRelation(shopId, VARIANT_HAS_OPTION_WITH_VALUE),
            variant.attributesInfo.map((attributeInfo) => ({
              variant_id: savedVariant.id,
              attribute_id: attributeIdMapping.get(attributeInfo.attributeId),
              value_id: valueIdMapping.get(attributeInfo.valueId),
            }))
          );
        }
      }

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
      )} a INNER JOIN ${sql(
        getTenantSpecificRelation(shopId, UPLOADED_IMAGES)
      )} b ON a.uploaded_image_id = b.id WHERE a.product_id = ${product.id};`;

      product.images = productImages;
    }
    return result;
  },

  findById: async (shopId, productId) => {
    const product = await db.findById(
      getTenantSpecificRelation(shopId, PRODUCTS),
      productId
    );

    if (!product) {
      throw new NotFound("Product not found");
    }

    const productImagesQuery = sql`SELECT * FROM ${sql(
      getTenantSpecificRelation(shopId, PRODUCTS_IMAGES)
    )} a INNER JOIN ${sql(
      getTenantSpecificRelation(shopId, UPLOADED_IMAGES)
    )} b ON a.uploaded_image_id = b.id WHERE a.product_id = ${productId};`;

    const categoryQuery = db.findById(CATEGORIES, product.category_id);

    const attributesQuery = sql`SELECT * FROM ${sql(
      getTenantSpecificRelation(shopId, PRODUCT_ATTRIBUTES)
    )} WHERE product_id = ${productId};`;

    const variantsQuery = sql`SELECT * FROM ${sql(
      getTenantSpecificRelation(shopId, PRODUCT_VARIANTS)
    )} a INNER JOIN ${sql(
      getTenantSpecificRelation(shopId, VARIANT_HAS_OPTION_WITH_VALUE)
    )} b ON a.id = b.variant_id WHERE product_id = ${productId};`;

    const [productImages, category, attributes, variants] = await Promise.all([
      productImagesQuery,
      categoryQuery,
      attributesQuery,
      variantsQuery,
    ]);

    for (let attribute of attributes) {
      attribute.values = await sql`SELECT * FROM ${sql(
        getTenantSpecificRelation(shopId, ATTRIBUTE_VALUES)
      )} WHERE attribute_id = ${attribute.id};`;
    }

    product.category = category;
    product.images = productImages ?? [];
    product.attributes = attributes ?? [];
    product.variants = variants ?? [];

    return product;
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
