const { OKResponse } = require("../responses/success");
const { getShopIdFromRequest } = require("../utils");
const uploadedImagesService = require("../services/uploaded-images");

const uploadedImagesController = {
  getAll: async (req, res) => {
    const shopId = getShopIdFromRequest(req);
    new OKResponse({
      metadata: await uploadedImagesService.getByTenantId(shopId),
    }).send(res);
  },

  getOne: async (req, res) => {
    const shopId = getShopIdFromRequest(req);
    const publicId = req.params.publicId;
    new OKResponse({
      metadata: await uploadedImagesService.getByPublicId(publicId, shopId),
    }).send(res);
  },
};

module.exports = uploadedImagesController;
