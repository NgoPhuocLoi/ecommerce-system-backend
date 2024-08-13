const { BadRequest } = require("../../responses/error");
const productService = require("../../services/product");
const { getShopIdFromRequest } = require("../../utils");

const validProduct = async (productId, { req }) => {
  const shopId = getShopIdFromRequest(req);
  const foundProduct = await productService.findById(shopId, productId);
  if (!foundProduct) {
    throw new BadRequest(`Product with id ${productId} does not exist`);
  }
};

module.exports = {
  validProduct,
};
