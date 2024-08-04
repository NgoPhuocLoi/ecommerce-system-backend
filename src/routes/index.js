const router = require("express").Router();

router.use("/version", require("./version"));
router.use("/auth", require("./auth"));
router.use("/shops", require("./shop"));

module.exports = router;
