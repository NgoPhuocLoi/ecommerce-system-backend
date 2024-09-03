const uploadedImagesController = require("../../controllers/uploaded-images");
const { asyncHandler } = require("../../middlewares/asyncHandler");

const router = require("express").Router();

router.get("", asyncHandler(uploadedImagesController.getAll));
router.get("/:publicId", asyncHandler(uploadedImagesController.getOne));

module.exports = router;
