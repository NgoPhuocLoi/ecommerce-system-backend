const router = require("express").Router();
const { body } = require("express-validator");
const { validate } = require("../../middlewares/validation");
const { asyncHandler } = require("../../middlewares/asyncHandler");

const customerAddressController = require("../../controllers/customer-address");

router.post(
  "/",
  body("provinceId").notEmpty().withMessage("Province ID is missing"),
  body("districtId").notEmpty().withMessage("District ID is missing"),
  body("wardCode").notEmpty().withMessage("Ward code is missing"),
  body("provinceName").notEmpty().withMessage("Province Name is missing"),
  body("districtName").notEmpty().withMessage("District Name is missing"),
  body("wardName").notEmpty().withMessage("Ward Name is missing"),
  body("detailAddress").notEmpty().withMessage("Detail address is missing"),
  body("phone").notEmpty().withMessage("Contact phone is missing"),
  body("isDefault")
    .notEmpty()
    .withMessage("isDefault is missing")
    .isBoolean()
    .withMessage("isDefault should be true or false"),
  validate,
  asyncHandler(customerAddressController.createAddress)
);

router.get("/", asyncHandler(customerAddressController.getAllAddresses));

module.exports = router;
