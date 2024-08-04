const { CreatedResponse, OKResponse } = require("../responses/success");
const shopService = require("../services/shop");

const shopController = {
  create: async (req, res) => {
    new CreatedResponse({
      metadata: await shopService.create({
        accountId: req.account.accountId,
        name: req.body.name,
      }),
    }).send(res);
  },

  getByAccountId: async (req, res) => {
    new OKResponse({
      metadata: await shopService.getByAccountId({
        accountId: req.account.accountId,
      }),
    }).send(res);
  },
};

module.exports = shopController;
