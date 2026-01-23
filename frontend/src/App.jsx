import { Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
import Register from "./pages/Register";
// import Products from "./pages/Products";
// import Cart from "./pages/Cart";
// import Orders from "./pages/Orders";

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Login />} /> */}
      <Route path="/register" element={<Register />} />
      {/* <Route path="/products" element={<Products />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/orders" element={<Orders />} /> */}
    </Routes>
  );
}

export default App;
