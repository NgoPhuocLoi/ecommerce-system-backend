const { BadRequest } = require("../../responses/error");
const onlineShopService = require("../../services/online-shop");
const { getShopIdFromRequest } = require("../../utils");

const validPage = async (pageId, { req }) => {
  const shopId = getShopIdFromRequest(req);
  const foundProduct = await onlineShopService.findByIdIfExist(shopId, pageId);
  if (!foundProduct) {
    throw new BadRequest(`Page with id ${pageId} does not exist`);
  }
};

module.exports = {
  validPage,
};
