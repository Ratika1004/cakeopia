require("dotenv").config();
const express =  require("express");


const connectDB= require("./shared/utils/connect-db");
const userRoutes =  require("./modules/users/routes/user-routes");
const productRoutes = require("./modules/products/routes/product-routes");
const cartRoutes = require("./modules/cart/routes/cart-routes");


const app = express();

app.use(express.json());
app.use(connectDB);

app.use("/users", userRoutes);
app.use("/products" , productRoutes);
app.use("/cart", cartRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT , () => {
    console.log(`cakeopia backend running on http://localhost:${PORT}`);
});