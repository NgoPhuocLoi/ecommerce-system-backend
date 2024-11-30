const router = require("express").Router();
const { asyncHandler } = require("../../middlewares/asyncHandler");
const orderController = require("../../controllers/order");
const { body } = require("express-validator");
const { validate } = require("../../middlewares/validation");

router.post(
  "/",
  body("totalPrice").notEmpty().withMessage("Total price is missing"),
  body("totalDiscount").notEmpty().withMessage("Total discount is missing"),
  body("finalPrice").notEmpty().withMessage("Final price is missing"),
  body("shippingFee").notEmpty().withMessage("Shipping fee is missing"),
  body("deliveryAddressId")
    .notEmpty()
    .withMessage("deliveryAddressId is missing"),
  body("paymentMethodId").notEmpty().withMessage("paymentMethodId is missing"),
  validate,
  asyncHandler(orderController.createOrder)
);

router.get("/", asyncHandler(orderController.getOrders));
router.get("/:orderId", asyncHandler(orderController.getOrder));

module.exports = router;
