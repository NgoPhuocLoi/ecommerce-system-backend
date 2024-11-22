const { CreatedResponse, OKResponse } = require("../responses/success");
const customerService = require("../services/customer");
const { getShopIdFromRequest } = require("../utils");

const customerController = {
  createCustomer: async (req, res) => {
    const shopId = getShopIdFromRequest(req);
    console.log({ body: req.body, shopId });
    new CreatedResponse({
      metadata: await customerService.createCustomerForShop(shopId, req.body),
    }).send(res);
  },

  login: async (req, res) => {
    const shopId = getShopIdFromRequest(req);
    new OKResponse({
      metadata: await customerService.login(shopId, req.body),
    }).send(res);
  },

  getProfile: async (req, res) => {
    const shopId = getShopIdFromRequest(req);
    new OKResponse({
      metadata: await customerService.getById(shopId, req.account.accountId),
    }).send(res);
  },
};

module.exports = customerController;
