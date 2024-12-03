const {
  ORDERS,
  ITEMS_IN_CART,
  ORDER_DETAILS,
  PAYMENTS,
  PRODUCT_VARIANTS,
  PRODUCTS,
  PRODUCTS_IMAGES,
  UPLOADED_IMAGES,
  VARIANT_HAS_OPTION_WITH_VALUE,
  ATTRIBUTE_VALUES,
  DELIVERY_ADDRESSES,
  CUSTOMERS,
} = require("../../constants/tenantSpecificRelations");
const { ORDER_STATUS } = require("../../constants/publicRelations");
const {
  getTenantSpecificRelation,
  convertToObjectWithCamelCase,
} = require("../../utils");
const { BadRequest } = require("../../responses/error");
const sql = require("../../config/db");

const shopManagementOrderService = {
  getOrders: async (shopId) => {
    const ordersRel = getTenantSpecificRelation(shopId, ORDERS);
    const customersRel = getTenantSpecificRelation(shopId, CUSTOMERS);
    const paymentRel = getTenantSpecificRelation(shopId, PAYMENTS);
    const orderDetailsRel = getTenantSpecificRelation(shopId, ORDER_DETAILS);

    const orders = await sql`
      SELECT o.*, json_build_object(
        'id', c.id,
        'name', c.last_name || ' ' || c.first_name,
        'email', c.email
      ) AS customer, 
       to_jsonb(p) AS payment
       FROM ${sql(ordersRel)} o
      INNER JOIN ${sql(customersRel)} c ON o.buyer_id = c.id
      INNER JOIN ${sql(paymentRel)} p ON o.order_id = p.order_id
      ORDER BY created_at DESC
    `;

    for (let order of orders) {
      const [{ total_items }] = await sql`
        SELECT COUNT(*) as total_items FROM ${sql(
          orderDetailsRel
        )} WHERE order_id = ${order.order_id}
      `;
      order.total_items = parseInt(total_items);
    }

    return orders;
  },

  getOrder: async (shopId, orderId) => {
    const ordersRel = getTenantSpecificRelation(shopId, ORDERS);
    const customersRel = getTenantSpecificRelation(shopId, CUSTOMERS);
    const paymentRel = getTenantSpecificRelation(shopId, PAYMENTS);
    const orderDetailsRel = getTenantSpecificRelation(shopId, ORDER_DETAILS);
    const variantsRel = getTenantSpecificRelation(shopId, PRODUCT_VARIANTS);
    const productsRel = getTenantSpecificRelation(shopId, PRODUCTS);
    const productImagesRel = getTenantSpecificRelation(shopId, PRODUCTS_IMAGES);
    const uploadedImagesRel = getTenantSpecificRelation(
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
    const deliveryAddressRel = getTenantSpecificRelation(
      shopId,
      DELIVERY_ADDRESSES
    );

    const [order] = await sql`
      SELECT o.*, json_build_object(
        'id', c.id,
        'name', c.last_name || ' ' || c.first_name,
        'email', c.email
      ) AS customer, 
       to_jsonb(p) AS payment,
        to_jsonb(da) AS delivery_address
       FROM ${sql(ordersRel)} o
      INNER JOIN ${sql(customersRel)} c ON o.buyer_id = c.id
      INNER JOIN ${sql(paymentRel)} p ON o.order_id = p.order_id
      INNER JOIN ${sql(
        deliveryAddressRel
      )} da ON o.delivery_address_id = da.delivery_address_id
      WHERE o.order_id = ${orderId}
    `;

    if (!order) {
      throw new BadRequest("Order not found");
    }

    const orderDetails = await sql`
      SELECT * FROM ${sql(orderDetailsRel)} WHERE order_id = ${orderId}
    `;

    const orderDetailWithProductInfo = await Promise.all(
      orderDetails.map(async (orderDetail) => {
        const [productInfo] = await sql`
          SELECT p.name, p.id FROM ${sql(variantsRel)} v INNER JOIN ${sql(
          productsRel
        )} p ON v.product_id  = p.id WHERE v.id = ${orderDetail.variant_id}
        `;

        const [productImage] = await sql`
          SELECT ui.* FROM (SELECT pi.uploaded_image_id FROM ${sql(
            productImagesRel
          )} pi WHERE pi.product_id = ${productInfo.id} LIMIT 1
          ) as temp INNER JOIN ${sql(
            uploadedImagesRel
          )} ui ON temp.uploaded_image_id = ui.id
        `;

        const variantValues = await sql`
          SELECT av.name, av.id FROM ${sql(
            variantHasOptionWithValueRelation
          )} vov INNER JOIN ${sql(
          attributeValuesRel
        )} av ON vov.value_id = av.id
        WHERE vov.variant_id = ${orderDetail.variant_id}
        `;

        return {
          ...convertToObjectWithCamelCase(orderDetail),
          productName: productInfo.name,
          productImageUrl: productImage.url,
          variantValues: variantValues,
        };
      })
    );

    order.order_details = orderDetailWithProductInfo;

    return order;
  },

  updateOrderStatus: async (shopId, orderId, { fromStatusId, toStatusId }) => {
    if (+fromStatusId + 1 != +toStatusId) {
      throw new BadRequest("Invalid request");
    }
    const ordersRel = getTenantSpecificRelation(shopId, ORDERS);

    const [order] = await sql`
      SELECT * FROM ${sql(ordersRel)} WHERE order_id = ${orderId}
    `;

    if (!order) {
      throw new BadRequest("Order not found");
    }
    // console.log({ fromStatusId, toStatusId, orderStatus: order.status_id });
    if (order.current_status_id !== fromStatusId) {
      throw new BadRequest("Order status is not valid");
    }

    await sql`
      UPDATE ${sql(ordersRel)}
      SET current_status_id = ${toStatusId}
      WHERE order_id = ${orderId}
    `;
  },
};

module.exports = shopManagementOrderService;
