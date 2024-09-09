const cloudinary = require("cloudinary").v2;
const { NotFound } = require("../responses/error");
const { getTenantSpecificRelation } = require("../utils");
const { UPLOADED_IMAGES } = require("../constants/tenantSpecificRelations");
const db = require("../helpers/db");

const uploadedImagesService = {
  saveUploadedImageInfo: async (uploadedImageInfo, tenantId) => {
    const preparedData = {
      uploaded_public_id: uploadedImageInfo.uploadedPublicId,
      url: uploadedImageInfo.url,
      format: uploadedImageInfo.format,
      size: uploadedImageInfo.size,
    };
    console.log({ preparedData });

    const uploadedImagesRelation = getTenantSpecificRelation(
      tenantId,
      UPLOADED_IMAGES
    );

    const result = await db.create(uploadedImagesRelation, preparedData);

    return result;
  },

  getPreview: async (tenantId) => {
    const result = await db.find(
      getTenantSpecificRelation(tenantId, UPLOADED_IMAGES)
    );

    return result;
  },

  getByTenantId: async (tenantId) => {
    console.log("RUN HERE");
    const res = await cloudinary.api.resources({
      type: "upload",
      prefix: tenantId.replace(/-/g, "_"),
    });

    return res.resources ?? [];
  },
  getByPublicId: async (publicId, tenantId) => {
    try {
      const res = await cloudinary.api.resource(publicId, {
        type: "upload",
        prefix: tenantId.replace(/-/g, "_"),
      });

      console.log({ res });

      return res;
    } catch (error) {
      if (error.error.http_code === 404) {
        throw new NotFound("Image not found");
      }
    }
  },
};

module.exports = uploadedImagesService;
