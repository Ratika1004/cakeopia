import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);

        if (res.data.weights?.length > 0) {
          setSelectedWeight(res.data.weights[0]);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (!selectedWeight) return alert("Please select a weight");

    try {
      await api.post("/cart/add", {
        productId: product._id,
        weight: selectedWeight.label,
        price: selectedWeight.price,
        quantity: quantity,
      });

      alert("Added to cart 🛒");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to cart");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!product) return null;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "60px",
        padding: "60px",
        fontFamily: "'Poppins', sans-serif",
        alignItems: "flex-start",
      }}
    >
      {/* LEFT SIDE - IMAGE */}
      <div style={{ flex: "1 1 400px" }}>
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              maxWidth: "500px",
              borderRadius: "20px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            }}
          />
        )}
      </div>

      {/* RIGHT SIDE - DETAILS */}
      <div style={{ flex: "1 1 400px" }}>
        <h2 style={{ fontSize: "32px", marginBottom: "10px" }}>
          {product.name}
        </h2>

        {/* Fake rating */}
        <p style={{ color: "#f4b400", marginBottom: "15px" }}>
          ⭐⭐⭐⭐☆ (124 reviews)
        </p>

        <p style={{ fontSize: "16px", color: "#555", marginBottom: "20px" }}>
          {product.description}
        </p>

        {/* WEIGHT SELECTOR */}
        <div style={{ marginBottom: "25px" }}>
          <h4>Select Weight:</h4>
          {product.weights?.map((weight) => (
            <button
              key={weight._id}
              onClick={() => setSelectedWeight(weight)}
              style={{
                margin: "5px",
                padding: "8px 16px",
                borderRadius: "8px",
                border:
                  selectedWeight?._id === weight._id
                    ? "2px solid #ff6b6b"
                    : "1px solid #ccc",
                backgroundColor:
                  selectedWeight?._id === weight._id
                    ? "#ffe5e5"
                    : "#fff",
                cursor: "pointer",
              }}
            >
              {weight.label}
            </button>
          ))}
        </div>

        {/* PRICE */}
        {selectedWeight && (
          <h3 style={{ color: "#ff6b6b", marginBottom: "20px" }}>
            ₹{selectedWeight.price}
          </h3>
        )}

        {/* QUANTITY */}
        <div style={{ marginBottom: "25px" }}>
          <h4>Quantity:</h4>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() =>
                setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
              }
              style={{
                padding: "5px 12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              -
            </button>

            <span style={{ fontSize: "18px" }}>{quantity}</span>

            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              style={{
                padding: "5px 12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* ADD TO CART */}
        <button
          onClick={addToCart}
          style={{
            padding: "12px 25px",
            backgroundColor: "#ff6b6b",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            cursor: "pointer",
            marginBottom: "25px",
          }}
        >
          Add to Cart 🛒
        </button>

        {/* DELIVERY INFO BOX */}
        <div
          style={{
            padding: "15px",
            backgroundColor: "#fff5f5",
            borderRadius: "10px",
            fontSize: "14px",
          }}
        >
          <p> ✨ 100% Eggless </p>
          <p> 📅 Order 2 days prior</p>
          <p> 🕙 Monday-sunday ( 10:00 AM - 7:00 PM )</p>
          <p> 🚚 Pickup and delivery available </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;