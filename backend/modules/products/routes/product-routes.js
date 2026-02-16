const { Router } = require("express");
const cloudinary = require("../../../config/cloudinary");
const ProductModel = require("../models/product-model");
const createProductRules = require("../middlewares/create-product-rules");
const updateProductRules = require("../middlewares/update-product-rules");
const checkValidation = require("../../../shared/middlewares/check-validation");
const authorize = require("../../../shared/middlewares/authorize");
const upload = require("../middlewares/upload-product-image");

const productRoutes = Router();

/* ======================================================
   GET ALL PRODUCTS (Only Available)
====================================================== */
productRoutes.get("/", async (req, res) => {
  try {
    const products = await ProductModel.find({ isAvailable: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

/* ======================================================
   GET PRODUCT BY ID (Only if Available)
====================================================== */
productRoutes.get("/:id", async (req, res) => {
  try {
    const product = await ProductModel.findOne({
      _id: req.params.id,
      isAvailable: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(400).json({ message: "Invalid product ID" });
  }
});

/* ======================================================
   CREATE PRODUCT (Admin Only)
====================================================== */
productRoutes.post(
  "/",
  authorize(["admin"]),
  upload.single("image"),
  createProductRules,
  checkValidation,
  async (req, res) => {
    try {
      let imageUrl = "";

      // Upload image to Cloudinary
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "cakeopia_products",
          width: 500,
          height: 500,
          crop: "fill",
        });

        imageUrl = result.secure_url;
      }

      const product = await ProductModel.create({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        weights: JSON.parse(req.body.weights), // important for FormData
        image: imageUrl,
        createdBy: req.account._id,
      });

      res.status(201).json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error creating product" });
    }
  }
);

/* ======================================================
   UPDATE PRODUCT (Admin Only)
====================================================== */
productRoutes.put(
  "/:id",
  authorize(["admin"]),
  updateProductRules,
  checkValidation,
  async (req, res) => {
    try {
      const updated = await ProductModel.findByIdAndUpdate(
  req.params.id,
  {
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    weights: req.body.weights
      ? JSON.parse(req.body.weights)
      : undefined,
    isAvailable: req.body.isAvailable,
  },
  { new: true }
);


      if (!updated) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Error updating product" });
    }
  }
);

/* ======================================================
   DELETE PRODUCT (Soft Delete - Admin Only)
====================================================== */
productRoutes.delete("/:id", authorize(["admin"]), async (req, res) => {
  try {
    const deleted = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { isAvailable: false },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting product" });
  }
});

module.exports = productRoutes;
