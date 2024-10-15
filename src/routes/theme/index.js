const { body, param } = require("express-validator");
const themeController = require("../../controllers/theme");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { validate } = require("../../middlewares/validation");
const {
  validTheme,
  uniqueLink,
} = require("../../middlewares/validation/theme");

const router = require("express").Router();

router.get("/", asyncHandler(themeController.getThemes));
//TODO: check admin role
router.post(
  "/",
  body("name").notEmpty().withMessage("Name is missing"),
  validate,

  asyncHandler(themeController.createTheme)
);
router.get(
  "/:id",
  param("id").custom(validTheme).withMessage("Invalid theme ID"),
  validate,
  asyncHandler(themeController.getTheme)
);
router.put(
  "/:id",
  param("id").custom(validTheme),
  validate,
  asyncHandler(themeController.updateTheme)
);

router.put(
  "/:id/update-pages-position",
  param("id").custom(validTheme),
  validate,
  asyncHandler(themeController.updatePagesPositionInTheme)
);

router.delete(
  "/:id",
  param("id").isNumeric().custom(validTheme).withMessage("Invalid theme ID"),
  validate,
  asyncHandler(themeController.deleteTheme)
);

router.post(
  "/:id/pages",
  param("id").custom(validTheme),
  body("name").notEmpty().withMessage("Name is missing"),
  body("link").notEmpty().withMessage("Link is missing").custom(uniqueLink),
  validate,
  asyncHandler(themeController.createPageInTheme)
);

router.get(
  "/:id/pages",
  param("id").custom(validTheme),
  validate,
  asyncHandler(themeController.getPagesInTheme)
);

router.get(
  "/:id/pages/:pageId",
  param("id").custom(validTheme),
  validate,
  asyncHandler(themeController.getPageInTheme)
);

router.put(
  "/:id/pages/:pageId",
  param("id").custom(validTheme),
  validate,
  asyncHandler(themeController.updatePageInTheme)
);

router.delete(
  "/:id/pages/:pageId",
  param("id").custom(validTheme),
  validate,
  asyncHandler(themeController.deletePageInTheme)
);

module.exports = router;
