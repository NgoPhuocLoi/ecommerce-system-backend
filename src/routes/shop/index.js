const router = require("express").Router();
const { body, param } = require("express-validator");
const shopController = require("../../controllers/shop");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication } = require("../../middlewares/auth");
const { validate } = require("../../middlewares/validation");
const { validShopId } = require("../../middlewares/validation/shop");

router.post(
  "/",
  authentication,
  body("name").notEmpty().withMessage("Store's name can not be blank"),
  validate,
  asyncHandler(shopController.create)
);

router.get("/", authentication, asyncHandler(shopController.getByAccountId));

router.use(
  "/:shopId/products",
  authentication,
  param("shopId").custom(validShopId),
  validate,
  require("../product")
);

module.exports = router;
