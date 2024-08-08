const { BadRequest } = require("../../responses/error");
const shopService = require("../../services/shop");

const validShopId = async (shopId, { req }) => {
  const accountId = req.account.accountId;
  const foundShop = await shopService.getShopById({ accountId, shopId });
  if (!foundShop) {
    throw new BadRequest(`Shop with id ${shopId} does not exist`);
  }
};

module.exports = {
  validShopId,
};
