const { PAYMENTS, ORDERS } = require("../constants/tenantSpecificRelations");
const sql = require("../config/db");
const { PAYMENT_STATUS_ID_MAPPING } = require("../constants/paymentStatus");
const { getTenantSpecificRelation } = require("../utils");
const { BadRequest } = require("../responses/error");

const paymentService = {
  updatePaymentStatusOfOrder: async (shopId, orderId, vnPayResponseCode) => {
    const orderRelation = getTenantSpecificRelation(shopId, ORDERS);
    const paymentRel = getTenantSpecificRelation(shopId, PAYMENTS);

    const [foundOrder] = await sql`SELECT order_id FROM ${sql(
      orderRelation
    )} WHERE order_id = ${orderId}`;

    if (!foundOrder) {
      throw new BadRequest("Order not found");
    }

    const [foundPayment] = await sql`
        SELECT * FROM ${sql(paymentRel)} WHERE order_id = ${orderId}
    `;

    if (!foundPayment) {
      throw new BadRequest("Payment not found");
    }

    if (foundPayment.payment_status_id === PAYMENT_STATUS_ID_MAPPING.SUCCESS) {
      throw new BadRequest("Payment has been processed");
    }
    const paymentStatusIdToUpdate =
      vnPayResponseCode === "00"
        ? PAYMENT_STATUS_ID_MAPPING.SUCCESS
        : PAYMENT_STATUS_ID_MAPPING.FAILED;

    await sql`
        UPDATE ${sql(paymentRel)}
        SET payment_status_id = ${paymentStatusIdToUpdate}
        WHERE payment_id = ${foundPayment.payment_id}
    `;

    return "Payment status updated";
  },
};

module.exports = paymentService;
