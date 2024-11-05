const router = require("express").Router();
const { asyncHandler } = require("../../middlewares/asyncHandler");
const addressController = require("../../controllers/address");
const { query } = require("express-validator");
const { validate } = require("../../middlewares/validation");

router.get("/provinces", asyncHandler(addressController.getProvinces));
router.get(
  "/districts",
  query("provinceId").notEmpty().withMessage("Province ID is missing"),
  validate,
  asyncHandler(addressController.getDistricts)
);
router.get(
  "/wards",
  query("districtId").notEmpty().withMessage("District ID is missing"),
  validate,
  asyncHandler(addressController.getWards)
);

module.exports = router;
