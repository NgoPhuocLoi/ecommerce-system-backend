const { validationResult } = require("express-validator");
const { BadRequest } = require("../../responses/error");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new BadRequest("Invalid input", errors.errors));
  }
  next();
};

module.exports = { validate };
