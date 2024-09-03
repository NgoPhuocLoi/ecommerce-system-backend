const cloudinary = require("cloudinary").v2;
const { NotFound } = require("../responses/error");

const uploadedImagesService = {
  getByTenantId: async (tenantId) => {
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
