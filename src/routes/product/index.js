const router = require("express").Router({ mergeParams: true });
const productController = require("../../controllers/product");
const { asyncHandler } = require("../../middlewares/asyncHandler");

router.post("/", asyncHandler(productController.create));
router.get("/", asyncHandler(productController.getAll));
router.put("/", asyncHandler(productController.update));
router.delete("/", asyncHandler(productController.delete));

module.exports = router;
