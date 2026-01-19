const {body} = require("express-validator");
const checkValidation = require("../../../shared/middlewares/check-validation");

const loginUserRules = [
    body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("email must be valid")
    .normalizeEmail(),

    body("password")
    .notEmpty()
    .withMessage("password is required"),

    checkValidation,
];

module.exports = loginUserRules;