const {
  requiredValidShopIdHeader,
  authentication,
} = require("../middlewares/auth");

const router = require("express").Router();

router.use("/version", require("./version"));
router.use("/auth", require("./auth"));
router.use("/categories", require("./category"));
router.use("/shops", require("./shop"));

router.use(authentication);
router.use(requiredValidShopIdHeader);
router.use("/products", require("./product"));

module.exports = router;
