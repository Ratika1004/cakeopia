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

   return (
    <div>
      <h2>Our cakes</h2>
      {products.length === 0 && <p> No cakes available </p>}

      <ul>
        {products.map((product) => (
          <li key={product._id} style={{marginBottom:"10px"}}>
            <strong>{product.name}</strong> <br />
            Price : ₹{product.price} <br />
            {product.description}
          </li>
        ))}
      </ul>
    </div>
   )
 };

 export default Products;