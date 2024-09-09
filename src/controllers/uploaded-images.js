const { OKResponse } = require("../responses/success");
const { getShopIdFromRequest } = require("../utils");
const uploadedImagesService = require("../services/uploaded-images");

const uploadedImagesController = {
  saveUploadedImagesInfo: async (req, res) => {
    const shopId = getShopIdFromRequest(req);
    new OKResponse({
      metadata: await uploadedImagesService.saveUploadedImageInfo(
        req.body,
        shopId
      ),
    }).send(res);
  },

  getPreview: async (req, res) => {
    const shopId = getShopIdFromRequest(req);
    const publicId = req.query.publicId;
    new OKResponse({
      metadata: await uploadedImagesService.getPreview(shopId),
    }).send(res);
  },

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
