const { CreatedResponse, OKResponse } = require("../responses/success");
const productService = require("../services/product");
const {
  getShopIdFromRequest,
  convertToObjectWithSnakeCase,
} = require("../utils");

const productController = {
  create: async (req, res) => {
    new CreatedResponse({
      metadata: await productService.create(
        getShopIdFromRequest(req),
        req.body
      ),
    }).send(res);
  },
  getAll: async (req, res) => {
    new OKResponse({
      metadata: await productService.findByShopId(
        getShopIdFromRequest(req),
        req.query
      ),
    }).send(res);
  },
  getById: async (req, res) => {
    new OKResponse({
      metadata: await productService.findById(
        getShopIdFromRequest(req),
        req.params.productId
      ),
    }).send(res);
  },
  update: async (req, res) => {
    const productId = req.params.productId;
    const updatedData = convertToObjectWithSnakeCase(req.body);
    new OKResponse({
      metadata: await productService.updateById(
        getShopIdFromRequest(req),
        productId,
        updatedData
      ),
    }).send(res);
  },
  delete: async (req, res) => {
    const productId = req.params.productId;
    new OKResponse({
      metadata: await productService.deleteById(
        getShopIdFromRequest(req),
        productId
      ),
    }).send(res);
  },
};

module.exports = productController;
