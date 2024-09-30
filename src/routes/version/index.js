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
      version: "1.0.0",
    },
  }).send(res);
});

router.get("/test", requireAuth, (req, res) => {
  res.json(req.auth);
});

module.exports = router;
