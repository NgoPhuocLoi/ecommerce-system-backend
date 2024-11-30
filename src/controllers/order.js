const orderService = require("../services/order");
const { OKResponse, CreatedResponse } = require("../responses/success");
const { getShopIdFromRequest } = require("../utils");

const orderController = {
  createOrder: async (req, res) => {
    const shopId = getShopIdFromRequest(req);
    const customerId = req.account.accountId;
    new CreatedResponse({
      metadata: await orderService.createOrder(shopId, {
        ...req.body,
        buyerId: customerId,
      }),
    }).send(res);
  },

  getOrders: async (req, res) => {
    const shopId = getShopIdFromRequest(req);
    const customerId = req.account.accountId;
    new OKResponse({
      metadata: await orderService.getOrders(shopId, customerId),
    }).send(res);
  },

  getOrder: async (req, res) => {
    const shopId = getShopIdFromRequest(req);
    const customerId = req.account.accountId;
    new OKResponse({
      metadata: await orderService.getOrderDetail(
        shopId,
        customerId,
        req.params.orderId
      ),
    }).send(res);
  },
};

module.exports = orderController;
