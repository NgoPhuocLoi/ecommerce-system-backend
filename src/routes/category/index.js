const router = require("express").Router();
const categoryController = require("../../controllers/category");
const { asyncHandler } = require("../../middlewares/asyncHandler");

router.get("/", asyncHandler(categoryController.getByQuery));

module.exports = router;
