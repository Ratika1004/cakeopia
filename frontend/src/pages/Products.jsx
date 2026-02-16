import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data || []);
        setFilteredProducts(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter + Search + Sort
  useEffect(() => {
    let updated = [...products];

    if (search) {
      updated = updated.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      updated = updated.filter((p) => p.category === category);
    }

    if (sort === "low") {
  updated.sort(
    (a, b) => getLowestPrice(a) - getLowestPrice(b)
  );
} else if (sort === "high") {
  updated.sort(
    (a, b) => getLowestPrice(b) - getLowestPrice(a)
  );
}


    setFilteredProducts(updated);
    setCurrentPage(1);
  }, [search, category, sort, products]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const addToCart = async (productId) => {
    try {
      await api.post("/cart/add", { productId, quantity: 1 });
      showToast("Added to cart 🛒");
    } catch (err) {
      showToast("Failed to add to cart ❌");
    }
  };

  // Pagination
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // ---------------- STYLES ----------------

  const container = {
    padding: "50px 30px",
    background: "#fff7f2",
    minHeight: "100vh",
    fontFamily: "'Poppins', sans-serif",
  };

  const heading = {
    textAlign: "center",
    fontSize: "36px",
    fontWeight: "700",
    marginBottom: "30px",
    color: "#e85d75",
  };

  const controls = {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "40px",
    flexWrap: "wrap",
  };

  const inputStyle = {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  };

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 300px))",
    gap: "30px",
    justifyContent: "center",
  };

  const card = {
    background: "#fff",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative",
    width: "100%",
    maxWidth: "300px",
  };

  const imageWrapper = {
    width: "100%",
    height: "220px",
    overflow: "hidden",
  };

  const image = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s ease",
  };

  const content = {
    padding: "20px",
  };

  const addButton = {
    padding: "12px",
    border: "none",
    backgroundColor: "#e85d75",
    color: "#fff",
    fontSize: "15px",
    cursor: "pointer",
    width: "100%",
  };

  const skeletonCard = {
    background: "#eee",
    borderRadius: "20px",
    height: "350px",
    animation: "pulse 1.5s infinite",
    width: "100%",
    maxWidth: "300px",
  };

  // ----------------------------------------

  if (loading)
    return (
      <div style={container}>
        <style>
          {`
            @keyframes pulse {
              0% { opacity: 0.6; }
              50% { opacity: 1; }
              100% { opacity: 0.6; }
            }
          `}
        </style>

        <h2 style={heading}>Our Cakes</h2>
        <div style={grid}>
          {Array(6)
            .fill()
            .map((_, i) => (
              <div key={i} style={skeletonCard}></div>
            ))}
        </div>
      </div>
    );

  if (error)
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  const getLowestPrice = (product) => {
  if (!product.weights || product.weights.length === 0) return 0;

  return Math.min(...product.weights.map((w) => w.price));
};


  return (
    <div style={container}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, 20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
        `}
      </style>

      <h2 style={heading}>Our Cakes</h2>

      {/* Controls */}
      <div style={controls}>
        <input
          style={inputStyle}
          type="text"
          placeholder="Search cakes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={inputStyle}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="cake">Cake</option>
          <option value="cupcake">Cupcake</option>
          <option value="pastry">Pastry</option>
          <option value="custom">Custom</option>
        </select>

        <select
          style={inputStyle}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      {/* Products Grid */}
      <div style={grid}>
        {currentProducts.map((product) => (
          <div
            key={product._id}
            style={card}
            onClick={() => navigate(`/products/${product._id}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              const img = e.currentTarget.querySelector(".zoom-image");
              if (img) img.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              const img = e.currentTarget.querySelector(".zoom-image");
              if (img) img.style.transform = "scale(1)";
            }}
          >
            {/* Wishlist */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                showToast("Added to wishlist ❤️");
              }}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "white",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
              }}
            >
              ❤️
            </button>

            {/* Image */}
            {product.image && (
              <div style={imageWrapper}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={image}
                  className="zoom-image"
                />
              </div>
            )}

            <div style={content}>
              <h3>{product.name}</h3>
              <p style={{ color: "#e85d75", fontWeight: "600" }}>
               Starting from ₹{getLowestPrice(product)}

              </p>
              <p style={{ fontSize: "14px", color: "#666" }}>
                {product.description}
              </p>

              <div style={{ color: "#f4b400" }}>⭐⭐⭐⭐☆</div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQuickViewProduct(product);
                }}
                style={{
                  marginTop: "10px",
                  padding: "8px",
                  width: "100%",
                  border: "1px solid #e85d75",
                  background: "#fff",
                  color: "#e85d75",
                  cursor: "pointer",
                }}
              >
                Quick View 👁
              </button>
            </div>

            <button
              style={addButton}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product._id);
              }}
            >
              Add to Cart 🛒
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              margin: "0 5px",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "none",
              background: currentPage === i + 1 ? "#e85d75" : "#ddd",
              color: currentPage === i + 1 ? "#fff" : "#000",
              cursor: "pointer",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Toast */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#e85d75",
            color: "#fff",
            padding: "15px 25px",
            borderRadius: "30px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            fontWeight: "500",
            animation: "fadeIn 0.3s ease",
            zIndex: 9999,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          onClick={() => setQuickViewProduct(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "20px",
              width: "500px",
            }}
          >
            <img
              src={quickViewProduct.image}
              alt={quickViewProduct.name}
              style={{ width: "100%", borderRadius: "15px" }}
            />
            <h3>{quickViewProduct.name}</h3>
            <p>{quickViewProduct.description}</p>
            <p style={{ color: "#e85d75", fontWeight: "600" }}>
              ₹{quickViewProduct.price}
            </p>
            <button
              onClick={() => addToCart(quickViewProduct._id)}
              style={{
                padding: "10px 20px",
                background: "#e85d75",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
