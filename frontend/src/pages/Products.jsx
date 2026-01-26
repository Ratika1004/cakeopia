import { useEffect , useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Products = () => {
  const [ products , setProducts ] = useState([]);
  const [ loading , setLoading ] = useState(true);
  const [ error , setError ] =  useState("");

  const {user} = useAuth();
  const navigate = useNavigate();

  useEffect(()=>{
    if (!user){
      navigate("/");
    }
  } , [user,navigate]);

  useEffect(()=> {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  },[]);

   if(loading) return <p> Loading Cakes...</p>
   if(error) return <p style={{color : "red"}} > {error} </p>;

   const addToCart = async (productId) => {
    try {
      await api.post("/cart/add" , {
        productId,
        quantity : 1,
      });
      alert("Added to cart")
    } catch(err){
      alert(err.response?.data?.message || "failed to add to cart");
    }
   }

   return (
    <div>
      <h2>Our cakes</h2>
      {products.length === 0 && <p> No cakes available </p>}

      <ul>
        {products.map((product) => (
          <li key={product._id} style={{marginBottom:"20px"}}>
            <strong>{product.name}</strong> <br />
            Price : ₹{product.price} <br />
            {product.description} <br />
            <button onClick={() => addToCart(product._id)}>
              Add to Cart
            </button>
        
          </li>
      
        ))}
      </ul>
    </div>
   )
 };

 export default Products;