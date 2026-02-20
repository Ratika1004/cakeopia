const { Router } = require("express");
const CartModel = require("../models/cart-model");
const ProductModel = require("../../products/models/product-model");
const updateCartRules = require("../middlewares/update-cart-rules");
const checkValidation = require("../../../shared/middlewares/check-validation");
const authorize = require("../../../shared/middlewares/authorize");

const cartRoutes = Router();

/* =========================================
   GET CURRENT USER CART
========================================= */
cartRoutes.get(
  "/",
  authorize(["customer", "admin"]),
  async (req, res) => {
    try {
      const cart = await CartModel.findOne({
        user: req.account._id,
      }).populate("items.product");

      res.json(cart || { user: req.account._id, items: [] });
    } catch (err) {
      res.status(500).json({ message: "Error fetching cart" });
    }
  }
);

/* =========================================
   ADD TO CART
========================================= */
cartRoutes.post(
  "/add",
  authorize(["customer", "admin"]),
  updateCartRules,
  checkValidation,
  async (req, res) => {
    try {
      const { productId, weight, quantity } = req.body;

      // Find product
      const product = await ProductModel.findById(productId);

      if (!product || !product.isAvailable) {
        return res.status(404).json({ message: "Product not available" });
      }

      // Validate weight exists in product
      const selectedWeight = product.weights.find(
        (w) => w.label === weight
      );

      if (!selectedWeight) {
        return res.status(400).json({ message: "Invalid weight selected" });
      }

      const price = selectedWeight.price;

      let cart = await CartModel.findOne({
        user: req.account._id,
      });

      // If no cart → create
      if (!cart) {
        cart = await CartModel.create({
          user: req.account._id,
          items: [{ product: productId, weight, price, quantity }],
        });

        return res.status(201).json(cart);
      }

      // Check if same product + weight already exists
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.product.toString() === productId &&
          item.weight === weight
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({
          product: productId,
          weight,
          price,
          quantity,
        });
      }

      await cart.save();

      const updatedCart = await CartModel.findOne({
        user: req.account._id,
      }).populate("items.product");

      res.json(updatedCart);
    } catch (err) {
      res.status(500).json({ message: "Error updating cart" });
    }
  }
);

/* =========================================
   UPDATE QUANTITY
========================================= */
cartRoutes.put(
  "/update",
  authorize(["customer", "admin"]),
  async (req, res) => {
    try {
      const { productId, weight, quantity } = req.body;

      if (!productId || !weight || quantity < 1) {
        return res.status(400).json({ message: "Invalid data" });
      }

      const cart = await CartModel.findOne({ user: req.account._id });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const item = cart.items.find(
        (item) =>
          item.product.toString() === productId &&
          item.weight === weight
      );

      if (!item) {
        return res.status(404).json({ message: "Item not found in cart" });
      }

      item.quantity = quantity;

      await cart.save();

      const updatedCart = await CartModel.findOne({
        user: req.account._id,
      }).populate("items.product");

      res.json(updatedCart);
    } catch (err) {
      res.status(500).json({ message: "Error updating cart item" });
    }
  }
);

/* =========================================
   REMOVE ITEM (productId + weight)
========================================= */
cartRoutes.delete(
  "/remove/:productId/:weight",
  authorize(["customer", "admin"]),
  async (req, res) => {
    try {
      const { productId, weight } = req.params;

      const cart = await CartModel.findOne({
        user: req.account._id,
      });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      cart.items = cart.items.filter(
        (item) =>
          !(
            item.product.toString() === productId &&
            item.weight === weight
          )
      );

      await cart.save();

      const updatedCart = await CartModel.findOne({
        user: req.account._id,
      }).populate("items.product");

      res.json(updatedCart);
    } catch (err) {
      res.status(500).json({ message: "Error removing item from cart" });
    }
  }
);

/* =========================================
   CLEAR CART
========================================= */
cartRoutes.delete(
  "/clear",
  authorize(["customer", "admin"]),
  async (req, res) => {
    try {
      await CartModel.findOneAndDelete({
        user: req.account._id,
      });

      res.json({ message: "Cart cleared successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error clearing cart" });
    }
  }
);

module.exports = cartRoutes;