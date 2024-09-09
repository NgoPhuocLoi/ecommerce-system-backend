const { body } = require("express-validator");
const uploadedImagesController = require("../../controllers/uploaded-images");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { validate } = require("../../middlewares/validation");

const router = require("express").Router();

router.post(
  "",
  body("uploadedPublicId")
    .isString()
    .withMessage("uploadedPublicId must be a string"),
  body("url").isString().withMessage("url must be a string"),
  body("format").isString().withMessage("format must be a string"),
  body("size").isNumeric().withMessage("size must be a number"),
  validate,
  asyncHandler(uploadedImagesController.saveUploadedImagesInfo)
);
router.get("", asyncHandler(uploadedImagesController.getAll));
router.get("/preview", asyncHandler(uploadedImagesController.getPreview));
router.get("/:publicId", asyncHandler(uploadedImagesController.getOne));

module.exports = router;
