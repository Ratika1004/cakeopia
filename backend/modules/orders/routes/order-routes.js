const { Router } = require("express");
const OrderModel = require("../models/order-model");
const CartModel = require("../../cart/models/cart-model");
const authorize = require("../../../shared/middlewares/authorize");

const ordersRoute = Router();

ordersRoute.post("/", authorize(["customer"]), async (req, res) => {
  try {
    const user = req.account;

    const cart = await CartModel.findOne({ user: user._id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = cart.items.map((item) => ({
      productId: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await OrderModel.create({
      userId: user._id,
      items: orderItems,
      totalAmount,
    });

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
});

ordersRoute.get("/my", authorize(["customer"]), async (req, res) => {
  try {
    const userId = req.account._id;

    const orders = await OrderModel.find({ userId })
      .sort({ createdAt: -1 });

 
    return res.json(orders || []);
  } catch (error) {
    console.error("FETCH MY ORDERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});


ordersRoute.get("/", authorize(["admin"]), async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("userId", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
});

ordersRoute.put("/:id/status", authorize(["admin"]), async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await OrderModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status" });
  }
});

module.exports = ordersRoute;
