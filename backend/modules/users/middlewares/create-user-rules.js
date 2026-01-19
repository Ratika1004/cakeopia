const {body} =  require("express-validator");
const checkValidation = require("../../../shared/middlewares/check-validation");

const createUserRules = [
    body("name")
    .optional()
    .isString()
    .withMessage("name must be a string")
    .trim(),

    body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail(),

    body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({min : 8 })
    .withMessage("password must be atleast 8 characters")
    .matches(/\d/)
    .withMessage("password must contain a number"),

    body("phone")
    .optional()
    .isString()
    .withMessage("Address must be a String"),

    checkValidation,
];

module.exports = createUserRules;