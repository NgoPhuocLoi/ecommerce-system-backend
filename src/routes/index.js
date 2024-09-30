const { requireAuth } = require("@clerk/express");
const {
  requiredValidShopIdHeader,
  authentication,
} = require("../middlewares/auth");

const router = require("express").Router();

router.use("/version", require("./version"));
router.use("/auth", require("./auth"));
router.use("/categories", require("./category"));

router.use(requireAuth);
router.use("/shops", require("./shop"));
router.use(requiredValidShopIdHeader);
router.use("/products", require("./product"));
router.use("/uploaded-images", require("./uploaded-images"));
router.use("/online-shop", require("./online-shop"));

module.exports = router;
