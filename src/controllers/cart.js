const cartService = require("../services/cart");
const { OKResponse } = require("../responses/success");
const { getShopIdFromRequest } = require("../utils");

const cartController = {
  addToCart: async (req, res) => {
    const shopId = getShopIdFromRequest(req);
    const customerId = req.account.accountId;
    new OKResponse({
      metadata: await cartService.addToCart(shopId, customerId, req.body),
    }).send(res);
  },

  retrieveCart: async (req, res) => {
    const shopId = getShopIdFromRequest(req);
    const customerId = req.account.accountId;
    new OKResponse({
      metadata: await cartService.retrieveCart(shopId, customerId),
    }).send(res);
  },

  removeItemInCart: async (req, res) => {
    const shopId = getShopIdFromRequest(req);
    const customerId = req.account.accountId;
    new OKResponse({
      metadata: await cartService.removeItemInCart(
        shopId,
        customerId,
        req.params.itemId
      ),
    }).send(res);
  },

  clearCart: async (req, res) => {
    const shopId = getShopIdFromRequest(req);
    const customerId = req.account.accountId;
    new OKResponse({
      metadata: await cartService.clearCart(shopId, customerId),
    }).send(res);
  },

  countCart: async (req, res) => {
    const shopId = getShopIdFromRequest(req);
    const customerId = req.account.accountId;
    new OKResponse({
      metadata: await cartService.countCart(shopId, customerId),
    }).send(res);
  },
};

module.exports = cartController;
