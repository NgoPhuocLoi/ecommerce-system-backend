const { OKResponse, CreatedResponse } = require("../responses/success");
const onlineShopService = require("../services/online-shop");
const { getShopIdFromRequest } = require("../utils");

const onlineShopController = {
  getPages: async (req, res) => {
    const shopId = getShopIdFromRequest(req);
    new OKResponse({
      metadata: await onlineShopService.getPages(shopId),
    }).send(res);
  },

  createPage: async (req, res) => {
    const shopId = getShopIdFromRequest(req);
    new CreatedResponse({
      metadata: await onlineShopService.createPage(shopId, req.body),
    }).send(res);
  },

  updatePage: async (req, res) => {
    const shopId = getShopIdFromRequest(req);
    const pageId = req.params.pageId;
    new OKResponse({
      metadata: await onlineShopService.updatePage(shopId, pageId, req.body),
    }).send(res);
  },
};

module.exports = onlineShopController;
