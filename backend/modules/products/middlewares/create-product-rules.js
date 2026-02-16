const { body } = require("express-validator");

const createProductRules = [
  body("name")
    .notEmpty()
    .withMessage("Product name is required")
    .isString()
    .withMessage("Name must be a string"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["cake", "cupcake", "pastry", "custom"])
    .withMessage("Invalid category"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  // Validate weights (sent as JSON string via FormData)
  body("weights")
    .notEmpty()
    .withMessage("At least one weight is required")
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

module.exports = createProductRules;
