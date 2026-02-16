const { body } = require("express-validator");

const updateProductRules = [
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("category")
    .optional()
    .isIn(["cake", "cupcake", "pastry", "custom"])
    .withMessage("Invalid category"),

  body("weights")
    .optional()
    .custom((value) => {
      let parsed;

      try {
        parsed = JSON.parse(value);
      } catch (err) {
        throw new Error("Weights must be valid JSON");
      }

      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("Weights must be a non-empty array");
      }

      parsed.forEach((weight) => {
        if (!weight.label || typeof weight.label !== "string") {
          throw new Error("Each weight must have a valid label");
        }

        if (
          weight.price === undefined ||
          typeof weight.price !== "number" ||
          weight.price <= 0
        ) {
          throw new Error("Each weight must have a price greater than 0");
        }
      });

      return true;
    }),

  body("isAvailable")
    .optional()
    .isBoolean()
    .withMessage("isAvailable must be true or false"),
];

module.exports = updateProductRules;
