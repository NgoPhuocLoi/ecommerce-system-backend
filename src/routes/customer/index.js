const router = require("express").Router();
const { body } = require("express-validator");
const customerController = require("../../controllers/customer");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { validate } = require("../../middlewares/validation");
const {
  requireShopIdHeader,
  authentication,
} = require("../../middlewares/auth");

router.use("/payments", require("../payment"));
router.use(requireShopIdHeader);

router.post(
  "/",
  body("firstName").notEmpty().withMessage("First name is missing"),
  body("lastName").notEmpty().withMessage("Last name is missing"),
  body("email").notEmpty().withMessage("Email is missing"),
  body("password").notEmpty().withMessage("Password is missing"),
  validate,
  asyncHandler(customerController.createCustomer)
);

router.post("/login", asyncHandler(customerController.login));

router.get(
  "/profile",
  authentication,
  asyncHandler(customerController.getProfile)
);

router.use("/cart", authentication, require("../cart"));
router.use("/address", authentication, require("./address"));
router.use("/orders", authentication, require("../order"));

module.exports = router;
