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
      alert("Added to cart 🛒");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to cart");
    }
  };

  // ------------------- STYLES -------------------

  const containerStyle = {
    padding: "50px 30px",
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #fff8f3, #ffece3)",
    fontFamily: "'Poppins', sans-serif",
  };

  const headingStyle = {
    textAlign: "center",
    color: "#e85d75",
    fontSize: "36px",
    marginBottom: "40px",
    fontWeight: "700",
    letterSpacing: "1px",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px",
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const imageStyle = {
    width: "100%",
    height: "220px",
    objectFit: "cover",
  };

  const contentStyle = {
    padding: "20px",
  };

  const nameStyle = {
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
  };

  const priceStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#e85d75",
    marginBottom: "10px",
  };

  const descStyle = {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
    lineHeight: "1.5",
  };

  const buttonStyle = {
    padding: "12px",
    border: "none",
    backgroundColor: "#e85d75",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background 0.3s ease",
    borderBottomLeftRadius: "20px",
    borderBottomRightRadius: "20px",
  };

  // ------------------------------------------------

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading Cakes...</p>;

  if (error)
    return (
      <p style={{ color: "red", textAlign: "center" }}>
        {error}
      </p>
    );

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Our Cakes</h2>

      {products.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          No cakes available
        </p>
      ) : (
        <div style={gridStyle}>
          {products.map((product) => (
            <div
              key={product._id}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 45px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 15px 35px rgba(0,0,0,0.08)";
              }}
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  style={imageStyle}
                />
              )}

              <div style={contentStyle}>
                <div style={nameStyle}>
                  {product.name}
                </div>
                <div style={priceStyle}>
                  ₹{product.price}
                </div>
                <div style={descStyle}>
                  {product.description}
                </div>
              </div>

              <button
                style={buttonStyle}
                onClick={() => addToCart(product._id)}
              >
                Add to Cart 🛒
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
