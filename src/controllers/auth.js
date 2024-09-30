const authService = require("../services/auth");
const { CreatedResponse, OKResponse } = require("../responses/success");

const authController = {
  register: async (req, res) => {
    // const { firstName, lastName, email, password } = req.body;
    console.log(req.body);
    new CreatedResponse({
      message: "Account created",
      metadata: await authService.register(req.body.data),
    }).send(res);
  },
  login: async (req, res) => {
    new OKResponse({
      message: "Login successfully",
      metadata: await authService.login(req.body),
    }).send(res);
  },

  checkValidToken: async (req, res) => {
    new OKResponse({
      message: "Token is valid",
      metadata: req.account,
    }).send(res);
  },
};

module.exports = authController;
