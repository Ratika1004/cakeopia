const { body } = require("express-validator");

const updateCartRules = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required"),

  body("weight")
    .notEmpty()
    .withMessage("Weight is required"),

  body("price")
    .notEmpty()
    .isNumeric()
    .withMessage("Price must be a number"),

  body("quantity")
    .notEmpty()
    .isInt({ gt: 0 })
    .withMessage("Quantity must be greater than 0"),
];

module.exports = updateCartRules;