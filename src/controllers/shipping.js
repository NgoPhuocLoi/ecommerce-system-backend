const { OKResponse } = require("../responses/success");
const ShippingService = require("../services/shipping");

const shippingController = {
  calculateShippingFee: async (req, res) => {
    new OKResponse({
      metadata: await ShippingService.calculateShippingCost(req.body),
    }).send(res);
  },
};

module.exports = shippingController;
