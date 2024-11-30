const router = require("express").Router();
const paymentController = require("../../controllers/payment");
const { body } = require("express-validator");
const { validate } = require("../../middlewares/validation");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const {
  requireShopIdHeader,
  authentication,
} = require("../../middlewares/auth");

router.get("/vnpay_return", asyncHandler(paymentController.handleVNPayReturn));
router.get(
  "/ipn",
  asyncHandler(async (req, res) => {
    console.log("CALLED ME");
    res.send("OK");
  })
);

router.post(
  "/create-payment-url",
  requireShopIdHeader,
  authentication,
  body("orderId").notEmpty().withMessage("Order ID is missng"),
  body("amount").notEmpty().withMessage("Amount to pay is missing"),
  validate,
  asyncHandler(paymentController.createPaymentUrl)
);

module.exports = router;
