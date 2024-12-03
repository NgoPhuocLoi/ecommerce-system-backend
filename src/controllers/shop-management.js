const { OKResponse } = require("../responses/success");
const shopManagementCustomerService = require("../services/shop-management/customer");
const shopManagementOrderService = require("../services/shop-management/order");
const { getShopIdFromRequest } = require("../utils");

const shopManagementController = {
  getCustomers: async (req, res) => {
    const shopId = getShopIdFromRequest(req);

    new OKResponse({
      metadata: await shopManagementCustomerService.getCustomers(shopId),
    }).send(res);
  },

  getOrders: async (req, res) => {
    const shopId = getShopIdFromRequest(req);

    new OKResponse({
      metadata: await shopManagementOrderService.getOrders(shopId),
    }).send(res);
  },

  getOrder: async (req, res) => {
    const shopId = getShopIdFromRequest(req);
    const orderId = req.params.orderId;

    new OKResponse({
      metadata: await shopManagementOrderService.getOrder(shopId, orderId),
    }).send(res);
  },

  updateOrderStatus: async (req, res) => {
    const shopId = getShopIdFromRequest(req);
    const orderId = req.params.orderId;

    new OKResponse({
      metadata: await shopManagementOrderService.updateOrderStatus(
        shopId,
        orderId,
        req.body
      ),
    }).send(res);
  },
};

module.exports = shopManagementController;
