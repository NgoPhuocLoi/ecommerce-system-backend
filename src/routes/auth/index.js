const { register, login, checkValidToken } = require("../../controllers/auth");
const router = require("express").Router();
const { body, check } = require("express-validator");
const { validate, uniqueEmail } = require("../../middlewares/validation");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication } = require("../../middlewares/auth");

router.post(
  "/register",
  // body("firstName").notEmpty().withMessage("First name is missing!"),
  // body("lastName").notEmpty().withMessage("Last name is missing!"),
  // body("email").isEmail().withMessage("Invalid email!"),
  // // .custom(uniqueEmail),
  // body("password")
  //   .notEmpty()
  //   .withMessage("Password is missing!")
  //   .isLength({ min: 8 })
  //   .withMessage("Password should have at least 8 characters!"),
  // validate,
  asyncHandler(register)
);

// router.post(
//   "/login",
//   body("email", "Invalid email!").isEmail(),
//   body("password").notEmpty().trim().withMessage("Password is missing!"),
//   validate,
//   asyncHandler(login)
// );

// router.get("/", authentication, asyncHandler(checkValidToken));
// router.post(
//   "/loginWithGoogle",
//   asyncHandler(AuthController.loginWithGoogle)
// );

// router.post(
//   "/adminLogin",
//   body("email", "Invalid email!").isEmail(),
//   body("password").notEmpty().trim().withMessage("Password is missing!"),
//   validate,
//   asyncHandler(AuthController.adminLogin)
// );

// router.post(
//   "/adminLoginWithGoogle",
//   asyncHandler(AuthController.adminLoginWithGoogle)
// );

// router.get(
//   "/logged-in-account",
//   authentication,
//   AuthController.getLoggedInAccount
// );

module.exports = router;
