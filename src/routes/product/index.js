const router = require("express").Router({ mergeParams: true });
const { body, param } = require("express-validator");
const productController = require("../../controllers/product");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { validate } = require("../../middlewares/validation");
const { validCategory } = require("../../middlewares/validation/category");
const { validProduct } = require("../../middlewares/validation/product");

router.post(
  "/",
  body("name").notEmpty().withMessage("Product's name is required"),
  body("price")
    .notEmpty()
    .withMessage("Product's price is required")
    .isNumeric()
    .withMessage("Price must be a numeric"),
  body("compareAtPrice")
    .notEmpty()
    .withMessage("compareAtPrice is required")
    .isNumeric()
    .withMessage("compareAtPrice must be a numeric"),
  body("cost")
    .notEmpty()
    .withMessage("Cost is required")
    .isNumeric()
    .withMessage("cost must be a numeric"),
  body("categoryId").custom(validCategory),
  validate,
  asyncHandler(productController.create)
);

router.get("/", asyncHandler(productController.getAll));
router.get("/:productId", asyncHandler(productController.getById));
router.put(
  "/:productId",
  param("productId").custom(validProduct),
  validate,
  asyncHandler(productController.update)
);
router.delete(
  "/:productId",
  param("productId").custom(validProduct),
  validate,
  asyncHandler(productController.delete)
);

module.exports = router;
