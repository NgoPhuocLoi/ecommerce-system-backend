const router = require("express").Router();
const { body } = require("express-validator");
const cartController = require("../../controllers/cart");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { validate } = require("../../middlewares/validation");

router.post(
  "/",
  body("variantId").notEmpty(),
  body("quantity").notEmpty(),
  body("pricePerItem").notEmpty(),
  validate,
  asyncHandler(cartController.addToCart)
);

router.get("/", asyncHandler(cartController.retrieveCart));

router.get("/count", asyncHandler(cartController.countCart));

router.delete("/:itemId", asyncHandler(cartController.removeItemInCart));

router.delete("/", asyncHandler(cartController.clearCart));

module.exports = router;
