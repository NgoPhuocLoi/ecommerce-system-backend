const { body, param } = require("express-validator");
const onlineShopController = require("../../controllers/online-shop");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { validate } = require("../../middlewares/validation");
const { validPage } = require("../../middlewares/validation/online-shop");

const router = require("express").Router();

router.get("/pages", asyncHandler(onlineShopController.getPages));
router.get(
  "/pages/:pageId/layout",
  param("pageId").custom(validPage),
  validate,
  asyncHandler(onlineShopController.getPageLayout)
);
router.post(
  "/pages",
  body("name").notEmpty().withMessage("Page's name is missing"),
  validate,
  asyncHandler(onlineShopController.createPage)
);
router.put(
  "/pages/:pageId",
  param("pageId").custom(validPage),
  validate,
  asyncHandler(onlineShopController.updatePage)
);

module.exports = router;
