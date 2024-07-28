const { OKResponse } = require("../../responses/success");

const router = require("express").Router();

router.get("/", (req, res) => {
  new OKResponse({
    metadata: {
      version: "1.0.0",
    },
  }).send(res);
});

module.exports = router;
