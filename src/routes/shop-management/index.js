const router = require("express").Router();
const { asyncHandler } = require("../../middlewares/asyncHandler");
const shopManagementController = require("../../controllers/shop-management");
const { body } = require("express-validator");
const { validate } = require("../../middlewares/validation");
const { ORDER_STATUS_ID_MAPPING } = require("../../constants/orderStatus");

router.get("/customers", asyncHandler(shopManagementController.getCustomers));
router.get("/orders", asyncHandler(shopManagementController.getOrders));
router.get("/orders/:orderId", asyncHandler(shopManagementController.getOrder));
router.put(
  "/orders/:orderId/status",
  body("fromStatusId")
    .notEmpty()
    .withMessage("fromStatus is missing")
    .isIn(Object.values(ORDER_STATUS_ID_MAPPING))
    .withMessage("Invalid order status"),
  body("toStatusId")
    .notEmpty()
    .withMessage("toStatus is missing")
    .isIn(Object.values(ORDER_STATUS_ID_MAPPING))
    .withMessage("Invalid order status"),
  validate,
  asyncHandler(shopManagementController.updateOrderStatus)
);

module.exports = router;
