const authService = require("../services/auth");
const { CreatedResponse, OKResponse } = require("../responses/success");

const authController = {
  register: async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    new CreatedResponse({
      message: "Account created",
      metadata: await authService.register({
        firstName,
        lastName,
        email,
        password,
      }),
    }).send(res);
  },
  login: async (req, res) => {
    new OKResponse({
      message: "Login successfully",
      metadata: await authService.login(req.body),
    }).send(res);
  },
};

module.exports = authController;
