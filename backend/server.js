require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./shared/utils/connect-db");
const userRoutes = require("./modules/users/routes/user-routes");
const productRoutes = require("./modules/products/routes/product-routes");
const cartRoutes = require("./modules/cart/routes/cart-routes");
const ordersRoute = require("./modules/orders/routes/order-routes");

const app = express();


app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use(connectDB);


app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", ordersRoute);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Cakeopia backend running on http://localhost:${PORT}`);
});
