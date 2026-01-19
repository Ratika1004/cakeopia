const {body} =  require("express-validator");
const checkValidation = require("../../../shared/middlewares/check-validation");

const verifyLoginRules = [
    body("email")
    .notEmpty()
    .isEmail()
    .withMessage("valid email is required")
    .normalizeEmail(),

    body("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({min:6,max:6})
    .withMessage("OTP must be 6 digits")
    .isNumeric()
    .withMessage("OTP must be numerc"),

    checkValidation,
];

module.exports = verifyLoginRules;