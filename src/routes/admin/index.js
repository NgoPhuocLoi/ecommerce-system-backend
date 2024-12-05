const router = require("express").Router();
const adminManagementController = require("../../controllers/admin-management");
const { asyncHandler } = require("../../middlewares/asyncHandler");

router.get("/accounts", asyncHandler(adminManagementController.getAccounts));
router.get(
  "/accounts/:id",
  asyncHandler(adminManagementController.getAccountById)
);

module.exports = router;
