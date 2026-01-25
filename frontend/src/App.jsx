import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProtectedRoute from "./components/ProtectedRoutes";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products" element={<ProtectedRoute> <Products /> </ProtectedRoute>} />
   
      <Route path="/cart" element={<ProtectedRoute> <Cart /> </ProtectedRoute>} />
      <Route path="/orders" element={ <ProtectedRoute> <Orders /> </ProtectedRoute>} /> 
    </Routes>
  );
}

export default App;
