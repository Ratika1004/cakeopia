const {body} =  require("express-validator");

const updateProductRules = [
    body("name").optional().isString(),
    body("description").optional().isString(),
    body("price").optional().isFloat({gt:0}).withMessage("price must be greater than 0"),
    body("category").optional().isIn(["cake","cupcake","pastry","custom"]).withMessage("Invalid category"),
    body("Image").optional().isString(),
    body("isAvailable").optional().isBoolean(),
];

module.exports = updateProductRules;