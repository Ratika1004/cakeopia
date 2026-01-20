const {body} = require("express-validator");

const updateCartRules = [
    body("productId")
    .notEmpty()
    .withMessage("Product ID is required"),

    body("quantity")
    .notEmpty()
    .isInt({gt :0})
    .withMessage("Quantity must be greater than 0")
];

module.exports = updateCartRules;
