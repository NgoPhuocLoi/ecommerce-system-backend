const express = require("express");
const {
  handleNotFoundRoute,
  errorHandler,
} = require("./middlewares/errorHandler");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(clerkMiddleware());
// app.use("/uploads", express.static("uploads"));

app.use("/api", require("./routes"));
app.use(handleNotFoundRoute);
app.use(errorHandler);

module.exports = app;
