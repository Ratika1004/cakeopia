const express =  require("express");
require("dotenv").config();

const connectDB= require("./shared/utils/connect-db");
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes =  require("./modules/user/user.routes");

const app = express();

app.use(express.json());
app.use(connectDB);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT , () => {
    console.log("cakeopia backend running on port ${PORT}");
});