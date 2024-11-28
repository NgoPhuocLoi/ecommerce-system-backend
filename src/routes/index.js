const { requireAuth } = require("@clerk/express");
const {
  requiredValidShopIdHeader,
  authentication,
} = require("../middlewares/auth");

const router = require("express").Router();

router.use("/version", require("./version"));
router.use("/auth", require("./auth"));
router.use("/categories", require("./category"));
router.use("/shipping", require("./shipping"));
router.use("/addresses", require("./address"));
router.use("/customers", require("./customer"));

router.use("/shops", require("./shop"));
router.use("/online-shop", require("./online-shop"));
router.use("/products", require("./product"));
router.use(requireAuth);
router.use("/themes", require("./theme"));
router.use(requiredValidShopIdHeader);

router.use("/uploaded-images", require("./uploaded-images"));

module.exports = router;
