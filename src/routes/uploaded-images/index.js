const uploadedImagesController = require("../../controllers/uploaded-images");
const { asyncHandler } = require("../../middlewares/asyncHandler");

const router = require("express").Router();

router.get("", asyncHandler(uploadedImagesController.getAll));

module.exports = router;
