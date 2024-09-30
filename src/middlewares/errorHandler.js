const { NotFound } = require("../responses/error");
const { UnauthorizedError } = require("@clerk/express");

const handleNotFoundRoute = (req, res, next) => {
  throw new NotFound("Route not found!");
};

const errorHandler = (error, req, res, next) => {
  let message = error.message || "Internal Server Error";
  let statusCode = error.statusCode || 500;
  if (error instanceof UnauthorizedError) {
    message = "Unauthorized";
    statusCode = 401;
  }
  const errors = error.errors;
  res.status(statusCode).json({
    message,
    statusCode,
    errors,
  });
};

module.exports = { errorHandler, handleNotFoundRoute };
