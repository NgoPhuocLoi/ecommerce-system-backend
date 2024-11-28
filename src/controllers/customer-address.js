const customerAddressService = require("../services/customer-address");
const { CreatedResponse } = require("../responses/success");
const { getShopIdFromRequest } = require("../utils");

const customerAddressController = {
  createAddress: async (req, res) => {
    const shopId = getShopIdFromRequest(req);
    const customerId = req.account.accountId;
    new CreatedResponse({
      metadata: await customerAddressService.create(
        shopId,
        customerId,
        req.body
      ),
    }).send(res);
  },

  getAllAddresses: async (req, res) => {
    const shopId = getShopIdFromRequest(req);
    const customerId = req.account.accountId;
    new CreatedResponse({
      metadata: await customerAddressService.getAll(shopId, customerId),
    }).send(res);
  },
};

module.exports = customerAddressController;
