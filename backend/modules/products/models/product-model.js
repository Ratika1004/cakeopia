const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    description: { type: String },

    image: { type: String },

    weights: {
      type: [
        {
          label: {
            type: String,
            required: true
          },
          price: {
            type: Number,
            required: true,
            min: 0
          }
        }
      ],
      validate: [(val) => val.length > 0, "At least one weight is required"]
    },

    category: {
      type: String,
      enum: ["cake", "cupcake", "pastry", "custom"],
      required: true
    },

    allowsInscription: {
      type: Boolean,
      default: true
    },

    isAvailable: {
      type: Boolean,
      default: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
