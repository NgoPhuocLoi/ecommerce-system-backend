const sql = require("../config/db");
const db = require("../helpers/db");
const {
  getTenantSpecificRelation,
  convertToObjectWithCamelCase,
  convertToObjectWithSnakeCase,
} = require("../utils");
const {
  PRODUCT_VARIANTS,
  ITEMS_IN_CART,
  PRODUCTS,
  UPLOADED_IMAGES,
  VARIANT_HAS_OPTION_WITH_VALUE,
  ATTRIBUTE_VALUES,
  PRODUCTS_IMAGES,
} = require("../constants/tenantSpecificRelations");
const { BadRequest } = require("../responses/error");
const { transformList } = require("../utils/cart");

const cartService = {
  addToCart: async (
    shopId,
    customerId,
    { variantId, quantity, pricePerItem }
  ) => {
    const variantRelation = getTenantSpecificRelation(shopId, PRODUCT_VARIANTS);
    const foundVariant = await db.findById(variantRelation, variantId);

    if (!foundVariant) {
      throw new BadRequest("Variant not found");
    }

    const itemsInCartRelation = getTenantSpecificRelation(
      shopId,
      ITEMS_IN_CART
    );

    const existingItemInCart = await sql`SELECT id, quantity FROM ${sql(
      itemsInCartRelation
    )} WHERE variant_id = ${variantId} AND customer_id = ${customerId};`;

    if (existingItemInCart.length > 0) {
      const existingItem = existingItemInCart[0];
      const updatedQuantity = existingItem.quantity + quantity;

      if (updatedQuantity <= 0) {
        await db.deleteById(itemsInCartRelation, existingItem.id);
        return `Item with id ${existingItem.id} deleted`;
      }

      return db.updateById(itemsInCartRelation, existingItem.id, {
        quantity: updatedQuantity,
      });
    }

    if (quantity <= 0) {
      throw new BadRequest("Invalid quantity");
    }

    const itemInCart = convertToObjectWithSnakeCase({
      variantId,
      quantity,
      pricePerItem,
      customerId,
    });

    return db.create(itemsInCartRelation, itemInCart);
  },

  retrieveCart: async (shopId, customerId) => {
    const itemsInCartRelation = getTenantSpecificRelation(
      shopId,
      ITEMS_IN_CART
    );

    const variantsRelation = getTenantSpecificRelation(
      shopId,
      PRODUCT_VARIANTS
    );

    const productsRelation = getTenantSpecificRelation(shopId, PRODUCTS);

    const uploadedImagesRelation = getTenantSpecificRelation(
      shopId,
      UPLOADED_IMAGES
    );

    const variantHasOptionWithValueRelation = getTenantSpecificRelation(
      shopId,
      VARIANT_HAS_OPTION_WITH_VALUE
    );

    const attributeValuesRel = getTenantSpecificRelation(
      shopId,
      ATTRIBUTE_VALUES
    );

    const itemsInCart = await sql`SELECT temp.*, av.name FROM 
        (SELECT i.*, p.name as product_name, v.product_id FROM ${sql(
          itemsInCartRelation
        )} i
            INNER JOIN ${sql(variantsRelation)} v ON v.id = i.variant_id
            INNER JOIN ${sql(productsRelation)} p ON v.product_id = p.id
            WHERE customer_id = 1) as temp
        INNER JOIN ${sql(
          variantHasOptionWithValueRelation
        )} vov ON temp.variant_id = vov.variant_id
        INNER JOIN ${sql(attributeValuesRel)} av ON vov.value_id = av.id;`;

    const variants = transformList(
      itemsInCart.map(convertToObjectWithCamelCase)
    );

    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      const images = await sql`SELECT b.url FROM ${sql(
        getTenantSpecificRelation(shopId, PRODUCTS_IMAGES)
      )} a INNER JOIN ${sql(
        getTenantSpecificRelation(shopId, UPLOADED_IMAGES)
      )} b ON a.uploaded_image_id = b.id WHERE a.product_id = ${v.productId};`;
      variants[i].images = images;
    }

    return variants;
  },

  removeItemInCart: async (shopId, customerId, itemId) => {
    const itemsInCartRelation = getTenantSpecificRelation(
      shopId,
      ITEMS_IN_CART
    );
    const result = await db.deleteById(itemsInCartRelation, itemId);
    return `${result.length} item(s) deleted`;
  },

  clearCart: async (shopId, customerId) => {
    const itemsInCartRelation = getTenantSpecificRelation(
      shopId,
      ITEMS_IN_CART
    );
    const result = await sql`DELETE FROM ${sql(
      itemsInCartRelation
    )} WHERE customer_id = ${customerId};`;
    return `${result.length} item(s) deleted`;
  },

  countCart: async (shopId, customerId) => {
    const itemsInCartRelation = getTenantSpecificRelation(
      shopId,
      ITEMS_IN_CART
    );
    const result = await sql`SELECT SUM(quantity) FROM ${sql(
      itemsInCartRelation
    )} WHERE customer_id = ${customerId};`;

    return parseInt(result[0]?.sum) || 0;
  },
};

module.exports = cartService;
