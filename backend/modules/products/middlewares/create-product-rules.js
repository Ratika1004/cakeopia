const {body} = require( "express-validator");

const createProductRules = [
    body("name")
    .notEmpty()
    .withMessage("Product name is required")
    .isString(),

    body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({gt : 0})
    .withMessage("Price must be greater than 0"),

    body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["cake","cupcake","pastry","custom"])
    .withMessage("Invalid category"),

    body("description")
    .optional()
    .isString(),

    body("image")
    .optional()
    .isString(),

    body("isAvailable")
    .optional()
    .isBoolean(),
    
    
];

module.exports = createProductRules;