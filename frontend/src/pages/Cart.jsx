import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch cart items
  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data.items || []);
    } catch (err) {
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update quantity
  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      await api.put("/cart/update", { productId, quantity: newQty });
      fetchCart();
    } catch {
      alert("Failed to update quantity");
    }
  };

  // Remove item
  const removeItem = async (productId) => {
    try {
      await api.delete(`/cart/remove/${productId}`);
      fetchCart();
    } catch {
      alert("Failed to remove item");
    }
  };

  // Place order
  const placeOrder = async () => {
    try {
      await api.post("/orders");
      alert("Order placed successfully");
      navigate("/orders");
    } catch {
      alert("Failed to place order");
    }
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  // ------------------- STYLES -------------------
  const pageStyle = {
    padding: "40px 20px",
    minHeight: "100vh",
    backgroundColor: "#fef6f0",
    fontFamily: "'Poppins', sans-serif",
  };

  const headingStyle = {
    textAlign: "center",
    color: "#ff6b6b",
    fontSize: "32px",
    marginBottom: "30px",
    fontWeight: "600",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "200px",
  };

  const nameStyle = { fontSize: "20px", fontWeight: "600", color: "#333" };
  const priceStyle = { fontSize: "16px", fontWeight: "500", color: "#ff6b6b" };
  const qtyContainer = {
    display: "flex",
    alignItems: "center",
    margin: "15px 0",
  };
  const qtyButton = {
    padding: "5px 12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#ff6b6b",
    color: "#fff",
    cursor: "pointer",
  };
  const removeBtn = {
    marginTop: "10px",
    padding: "8px 12px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#f56565",
    color: "#fff",
    cursor: "pointer",
  };
  const placeOrderBtn = {
    marginTop: "20px",
    padding: "12px 20px",
    fontSize: "18px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#ff6b6b",
    color: "#fff",
    cursor: "pointer",
  };
  // ---------------------------------------------

  if (loading) return <p style={{ textAlign: "center" }}>Loading cart...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div style={pageStyle}>
      <h2 style={headingStyle}>Your Cart</h2>

      {cart.length === 0 ? (
        <p style={{ textAlign: "center" }}>Your cart is empty</p>
      ) : (
        <>
          <div style={gridStyle}>
            {cart.map((item) => (
              <div key={item.product?._id || Math.random()} style={cardStyle}>
                <div>
                  <div style={nameStyle}>{item.product?.name || "Unnamed Cake"}</div>
                  <div style={priceStyle}>₹{item.product?.price ?? "N/A"}</div>

                  <div style={qtyContainer}>
                    <button
                      style={qtyButton}
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span style={{ margin: "0 10px", fontSize: "16px" }}>{item.quantity}</span>
                    <button
                      style={qtyButton}
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    style={removeBtn}
                    onClick={() => removeItem(item.product._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ textAlign: "right", marginTop: "20px" }}>Total: ₹{totalAmount}</h3>
          <div style={{ textAlign: "right" }}>
            <button style={placeOrderBtn} onClick={placeOrder}>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
