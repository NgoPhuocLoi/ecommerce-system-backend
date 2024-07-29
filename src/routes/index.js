const router = require("express").Router();

router.use("/version", require("./version"));
router.use("/auth", require("./auth"));

module.exports = router;
