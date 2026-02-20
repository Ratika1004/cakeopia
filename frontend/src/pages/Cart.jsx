import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data.items || []);
    } catch {
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, weight, newQty) => {
    if (newQty < 1) return;
    try {
      await api.put("/cart/update", { productId, weight, quantity: newQty });
      fetchCart();
    } catch {
      alert("Failed to update quantity");
    }
  };

  const removeItem = async (productId, weight) => {
    try {
      await api.delete(`/cart/remove/${productId}/${weight}`);
      fetchCart();
    } catch {
      alert("Failed to remove item");
    }
  };

  const placeOrder = async () => {
    try {
      await api.post("/orders");
      alert("Order placed successfully 🎉");
      navigate("/orders");
    } catch {
      alert("Failed to place order");
    }
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (loading) return <p style={{ textAlign: "center" }}>Loading cart...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div
      style={{
        padding: "60px",
        fontFamily: "'Poppins', sans-serif",
        minHeight: "100vh",
        backgroundColor: "#fef6f0",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "40px", fontSize: "32px" }}>
        Your Cart 🛒
      </h2>

      {cart.length === 0 ? (
        <p style={{ textAlign: "center" }}>Your cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={`${item.product._id}-${item.weight}`}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "40px",
                marginBottom: "40px",
                backgroundColor: "#fff",
                padding: "30px",
                borderRadius: "20px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              }}
            >
              {/* IMAGE */}
              <div style={{ flex: "1 1 250px" }}>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    borderRadius: "15px",
                  }}
                />
              </div>

              {/* DETAILS */}
              <div style={{ flex: "2 1 400px" }}>
                <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>
                  {item.product.name}
                </h3>

                <p style={{ marginBottom: "10px", color: "#555" }}>
                  Weight: <strong>{item.weight}</strong>
                </p>

                <p style={{ color: "#ff6b6b", fontSize: "18px", marginBottom: "15px" }}>
                  ₹{item.price}
                </p>

                {/* QUANTITY */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.weight, item.quantity - 1)
                    }
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      cursor: "pointer",
                    }}
                  >
                    -
                  </button>

                  <span style={{ fontSize: "18px" }}>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.weight, item.quantity + 1)
                    }
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      cursor: "pointer",
                    }}
                  >
                    +
                  </button>
                </div>

                {/* ITEM TOTAL */}
                <p style={{ fontWeight: "600", marginBottom: "15px" }}>
                  Item Total: ₹{item.price * item.quantity}
                </p>

                {/* DELETE */}
                <button
                  onClick={() =>
                    removeItem(item.product._id, item.weight)
                  }
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#f56565",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* GRAND TOTAL SECTION */}
          <div
            style={{
              textAlign: "right",
              padding: "30px",
              backgroundColor: "#fff",
              borderRadius: "15px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>
              Grand Total: ₹{totalAmount}
            </h3>

            <button
              onClick={placeOrder}
              style={{
                padding: "14px 30px",
                backgroundColor: "#ff6b6b",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Place Order 🚀
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;