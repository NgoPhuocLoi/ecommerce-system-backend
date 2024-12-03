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

const shopManagementCustomerService = {
  getCustomers: async (shopId) => {
    const customersRel = getTenantSpecificRelation(shopId, CUSTOMERS);
    const ordersRel = getTenantSpecificRelation(shopId, ORDERS);
    const paymentRel = getTenantSpecificRelation(shopId, PAYMENTS);

    const customers = await sql`
      SELECT id, first_name, last_name, email, created_at FROM ${sql(
        customersRel
      )} ORDER BY created_at DESC
    `;
    for (let customer of customers) {
      const [{ order_count }] = await sql`
        SELECT COUNT(*) as order_count FROM ${sql(
          ordersRel
        )} WHERE buyer_id = ${customer.id}
        `;
      const [{ total_spent }] = await sql`
             SELECT SUM(amount) as total_spent FROM ${sql(paymentRel)} p
             INNER JOIN ${sql(ordersRel)} o ON p.order_id = o.order_id
              WHERE o.buyer_id = ${
                customer.id
              } AND (p.payment_method_id = 1 OR p.payment_method_id = 2 AND p.payment_status_id = 2)
             `;

      customer.totalSpent = total_spent ?? 0;
      customer.orderCount = parseInt(order_count);
      customer = convertToObjectWithCamelCase(customer);
    }
    return customers;
  },
};

module.exports = shopManagementCustomerService;
