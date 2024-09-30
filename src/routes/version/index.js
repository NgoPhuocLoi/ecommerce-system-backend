const { OKResponse } = require("../../responses/success");
const { UnAuthorized } = require("../../responses/error");
const {
  ClerkExpressWithAuth,
  ClerkExpressRequireAuth,
} = require("@clerk/clerk-sdk-node");
const { requireAuth } = require("@clerk/express");

const router = require("express").Router();

router.get("/", (req, res) => {
  new OKResponse({
    metadata: {
      version: "1.0.1",
    },
  }).send(res);
});

module.exports = router;
