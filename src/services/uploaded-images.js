const cloudinary = require("cloudinary").v2;

const uploadedImagesService = {
  getByTenantId: async (tenantId) => {
    const res = await cloudinary.api.resources({
      type: "upload",
      prefix: tenantId.replace(/-/g, "_"),
    });

    return res.resources ?? [];
  },
};

module.exports = uploadedImagesService;
