import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);

        // Auto select first weight
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
        quantity: 1,
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
    <div style={{ padding: "40px", fontFamily: "'Poppins', sans-serif" }}>
      <h2 style={{ color: "#ff6b6b" }}>{product.name}</h2>

      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          style={{
            maxWidth: "400px",
            borderRadius: "15px",
            marginBottom: "20px",
          }}
        />
      )}

      <p style={{ fontSize: "18px", color: "#333" }}>
        {product.description}
      </p>

      {/* WEIGHT SELECTOR */}
      <div style={{ margin: "20px 0" }}>
        <h4>Select Weight:</h4>

        {product.weights?.map((weight) => (
          <button
            key={weight._id}
            onClick={() => setSelectedWeight(weight)}
            style={{
              margin: "5px",
              padding: "8px 15px",
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

      {/* DYNAMIC PRICE */}
      {selectedWeight && (
        <p
          style={{
            fontWeight: "600",
            color: "#ff6b6b",
            fontSize: "22px",
          }}
        >
          Price: ₹{selectedWeight.price}
        </p>
      )}

      <button
        style={{
          padding: "10px 20px",
          backgroundColor: "#ff6b6b",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "16px",
          marginTop: "15px",
        }}
        onClick={addToCart}
      >
        Add to Cart 🛒
      </button>
    </div>
  );
};

export default ProductDetails;
