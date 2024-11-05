const { CreatedResponse, OKResponse } = require("../responses/success");
const shopService = require("../services/shop");
const { getAuth } = require("@clerk/express");

const shopController = {
  create: async (req, res) => {
    const auth = getAuth(req);
    new CreatedResponse({
      metadata: await shopService.create({
        accountId: auth.userId,
        ...req.body,
      }),
    }).send(res);
  },

  getByAccountId: async (req, res) => {
    const auth = getAuth(req);
    console.log(auth);
    new OKResponse({
      metadata: await shopService.getByAccountId({
        accountId: auth.userId,
      }),
    }).send(res);
  },

  getByDomain: async (req, res) => {
    new OKResponse({
      metadata: await shopService.getByDomain(req.params.domain),
    }).send(res);
  },
};

module.exports = shopController;
