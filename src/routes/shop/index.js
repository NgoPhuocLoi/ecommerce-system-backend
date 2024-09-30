const router = require("express").Router();
const { body } = require("express-validator");
const shopController = require("../../controllers/shop");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication } = require("../../middlewares/auth");
const { validate } = require("../../middlewares/validation");

router.post(
  "/",
  body("name").notEmpty().withMessage("Store's name can not be blank"),
  validate,
  asyncHandler(shopController.create)
);

router.get("/", asyncHandler(shopController.getByAccountId));

module.exports = router;
