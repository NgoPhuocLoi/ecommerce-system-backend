const router = require("express").Router();
const { body } = require("express-validator");
const shopController = require("../../controllers/shop");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { validate } = require("../../middlewares/validation");
const { requireAuth } = require("@clerk/express");

router.get("/", asyncHandler(shopController.getByAccountId));
router.get("/domain/:domain", asyncHandler(shopController.getByDomain));
router.post(
  "/",
  body("name").notEmpty().withMessage("Store's name can not be blank"),
  body("hasUsedPlatformBefore")
    .notEmpty()
    .withMessage("hasUsedPlatformBefore can not be blank")
    .isBoolean()
    .withMessage("hasUsedPlatformBefore must be a boolean"),
  body("hasConfirmedEmail")
    .notEmpty()
    .withMessage("hasConfirmedEmail can not be blank")
    .isBoolean()
    .withMessage("hasConfirmedEmail must be a boolean"),
  body("provinceId").notEmpty().withMessage("provinceId can not be blank"),
  body("provinceName").notEmpty().withMessage("provinceName can not be blank"),
  body("districtId").notEmpty().withMessage("districtId can not be blank"),
  body("districtName").notEmpty().withMessage("districtName can not be blank"),
  body("wardCode").notEmpty().withMessage("wardCode can not be blank"),
  body("wardName").notEmpty().withMessage("wardName can not be blank"),
  body("phone")
    .notEmpty()
    .withMessage("phone can not be blank")
    .isMobilePhone("vi-VN")
    .withMessage("phone must be a valid phone number"),
  validate,
  requireAuth,
  asyncHandler(shopController.create)
);

module.exports = router;
