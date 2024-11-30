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
} = require("../constants/tenantSpecificRelations");
const { ORDER_STATUS } = require("../constants/publicRelations");
const {
  getTenantSpecificRelation,
  convertToObjectWithCamelCase,
} = require("../utils");
const { BadRequest } = require("../responses/error");
const cartService = require("./cart");

const { ORDER_STATUS_ID_MAPPING } = require("../constants/orderStatus");
const sql = require("../config/db");
const { PAYMENT_STATUS_ID_MAPPING } = require("../constants/paymentStatus");
const customerAddressService = require("./customer-address");
/**
  items format :
  [
    {
        variantId,
        quantity,
        price,
        discount 
    }
]
 */
const validateOrder = ({ itemsInCart, preparedOrder }) => {
  const totalPriceFromItemsInCart = itemsInCart.reduce((acc, item) => {
    return acc + item.price_per_item * item.quantity;
  }, 0);

  console.log({
    totalPriceFromItemsInCart,
    preparedOrder: preparedOrder.total_price - totalPriceFromItemsInCart,
  });
  if (totalPriceFromItemsInCart != preparedOrder.total_price) {
    throw new BadRequest("Invalid total price");
  }

  if (
    preparedOrder.total_price +
      preparedOrder.shipping_fee -
      preparedOrder.total_discount !==
    preparedOrder.final_price
  ) {
    throw new BadRequest("Invalid final price");
  }
};

const orderService = {
  createOrder: async (
    shopId,
    {
      totalPrice,
      totalDiscount,
      finalPrice,
      shippingFee,
      buyerId,
      deliveryAddressId,
      paymentMethodId,
      items = [],
      usedCouponId,
    }
  ) => {
    const orderRelation = getTenantSpecificRelation(shopId, ORDERS);
    const itemsInCartRel = getTenantSpecificRelation(shopId, ITEMS_IN_CART);
    const orderDetailsRel = getTenantSpecificRelation(shopId, ORDER_DETAILS);
    const paymentRel = getTenantSpecificRelation(shopId, PAYMENTS);

    const itemsInCart = await sql`SELECT * FROM ${sql(
      itemsInCartRel
    )} WHERE customer_id = ${buyerId}`;

    const preparedOrder = {
      total_price: totalPrice,
      total_discount: totalDiscount,
      final_price: finalPrice,
      shipping_fee: shippingFee,
      buyer_id: buyerId,
      delivery_address_id: deliveryAddressId,
      used_coupon_id: usedCouponId,
      current_status_id: ORDER_STATUS_ID_MAPPING.AWAITING_CONFIRM,
      used_coupon_id: null, // NOTE: adapt if coupon is implemented
      created_at: new Date(),
      updated_at: new Date(),
    };

    validateOrder({ itemsInCart, preparedOrder });

    const createdOrder = await sql.begin(async (sql) => {
      const [createdOrder] = await sql`INSERT INTO ${sql(orderRelation)} ${sql(
        preparedOrder
      )} RETURNING order_id;`;

      const preparedOrderDetails = itemsInCart.map((item) => ({
        order_id: createdOrder.order_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        price: item.price_per_item,
        discount: 0, // NOTE: adapt if discount is implemented
      }));

      const details = await sql`INSERT INTO ${sql(orderDetailsRel)} ${sql(
        preparedOrderDetails
      )}`;

      const createdPayment = await sql`INSERT INTO ${sql(paymentRel)} ${sql({
        order_id: createdOrder.order_id,
        payment_method_id: paymentMethodId,
        payment_status_id: PAYMENT_STATUS_ID_MAPPING.PENDING,
        amount: finalPrice,
        created_at: new Date(),
        updated_at: new Date(),
      })}`;

      await cartService.clearCart(shopId, buyerId);

      return createdOrder;
    });

    return createdOrder;
  },

  getOrders: async (shopId, customerId) => {
    const orderRelation = getTenantSpecificRelation(shopId, ORDERS);
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

    const paymentRel = getTenantSpecificRelation(shopId, PAYMENTS);

    const orders = await sql`
      SELECT o.*, os.name as current_status FROM ${sql(orderRelation)} o 
      INNER JOIN ${sql(ORDER_STATUS)} os ON o.current_status_id = os.id
      WHERE buyer_id = ${customerId} ORDER BY created_at DESC
    `;

    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const [{ total_items }] = await sql`
        SELECT SUM(quantity) as total_items FROM ${sql(
          orderDetailsRel
        )} WHERE order_id = ${order.order_id}
      `;
        const [orderDetail] = await sql`
          SELECT * FROM ${sql(orderDetailsRel)} WHERE order_id = ${
          order.order_id
        } LIMIT 1
        `;

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
        )} av ON vov.value_id = av.id WHERE vov.variant_id = ${
          orderDetail.variant_id
        }
        `;

        const [payment] = await sql`
          SELECT * FROM ${sql(paymentRel)} WHERE order_id = ${order.order_id}
        `;

        return {
          ...convertToObjectWithCamelCase(order),
          totalItems: parseInt(total_items) || 0,
          orderPreview: {
            ...convertToObjectWithCamelCase(orderDetail),
            productName: productInfo.name,
            productImageUrl: productImage.url,
            variantValues: variantValues,
          },
          payment: convertToObjectWithCamelCase(payment),
        };
      })
    );

    return ordersWithDetails;
  },

  getOrderDetail: async (shopId, customerId, orderId) => {
    const orderRelation = getTenantSpecificRelation(shopId, ORDERS);
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
    const customersRel = getTenantSpecificRelation(shopId, CUSTOMERS);
    const deliveryAddressRel = getTenantSpecificRelation(
      shopId,
      DELIVERY_ADDRESSES
    );
    const paymentRel = getTenantSpecificRelation(shopId, PAYMENTS);

    const [order] = await sql`
      SELECT o.*, os.name as current_status FROM ${sql(orderRelation)} o 
      INNER JOIN ${sql(ORDER_STATUS)} os ON o.current_status_id = os.id
      WHERE buyer_id = ${customerId} AND o.order_id = ${orderId}
    `;

    if (!order) {
      throw new BadRequest("Order not found");
    }

    const [{ total_items }] = await sql`
        SELECT SUM(quantity) as total_items FROM ${sql(
          orderDetailsRel
        )} WHERE order_id = ${orderId}
      `;
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

    const [deliveryAddress] = await sql`
      SELECT da.*, c.last_name || ' ' || c.first_name as customer_name, c.email FROM ${sql(
        deliveryAddressRel
      )}  da
      INNER JOIN ${sql(customersRel)} c ON da.customer_id = c.id
      WHERE da.customer_id = ${customerId} AND da.delivery_address_id = ${
      order.delivery_address_id
    }
    `;

    const [payment] = await sql`
      SELECT * FROM ${sql(paymentRel)} WHERE order_id = ${orderId}
    `;

    console.log({ payment });

    return {
      ...convertToObjectWithCamelCase(order),
      totalItems: parseInt(total_items) || 0,
      orderDetails: orderDetailWithProductInfo,
      deliveryAddress: convertToObjectWithCamelCase(deliveryAddress),
      payment: convertToObjectWithCamelCase(payment),
    };
  },
};

module.exports = orderService;
