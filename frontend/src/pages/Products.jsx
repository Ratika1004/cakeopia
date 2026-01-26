import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    try {
      await api.post("/cart/add", { productId, quantity: 1 });
      alert("Added to cart");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to cart");
    }
  };

  // ------------------- STYLES -------------------
  const containerStyle = {
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

  const nameStyle = {
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "10px",
  };

  const priceStyle = {
    fontSize: "16px",
    fontWeight: "500",
    color: "#ff6b6b",
    marginBottom: "10px",
  };

  const descStyle = {
    fontSize: "14px",
    color: "#666",
    marginBottom: "15px",
  };

  const buttonStyle = {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#ff6b6b",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
  };
  // ---------------------------------------------

  if (loading) return <p style={{ textAlign: "center" }}>Loading Cakes...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Our Cakes</h2>

      {products.length === 0 ? (
        <p style={{ textAlign: "center" }}>No cakes available</p>
      ) : (
        <div style={gridStyle}>
          {products.map((product) => (
            <div key={product._id || Math.random()} style={cardStyle}>
              <div>
                <div style={nameStyle}>{product.name || "Unnamed Cake"}</div>
                <div style={priceStyle}>₹{product.price ?? "N/A"}</div>
                <div style={descStyle}>{product.description || "No description"}</div>
              </div>
              <button
                style={buttonStyle}
                onClick={() => addToCart(product._id)}
                disabled={!product._id}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
