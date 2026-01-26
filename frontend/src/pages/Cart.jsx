import { useEffect , useState } from "react";
import {useNavigate} from "react-router-dom";
import api from "../api/axios";

const Cart = () => {
  const [cart , setCart] = useState([]);
  const [loading , setLoading] = useState(true);
  const [error , setError] = useState("");

  const fetchCart = async () => {
    try{
       const res = await api.get("/cart");
       setCart(res.data.items || []);
    // eslint-disable-next-line no-unused-vars
    } catch(err) {
      setError ("failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchCart();
  },[]);


  //update quantity
  const updateQuantity = async ( productId , newQty) =>{
    if(newQty < 1) return ;

    try {
      await api.put("/cart/update" , {
        productId,
        quantity : newQty,
      });
      fetchCart();
    // eslint-disable-next-line no-unused-vars
    } catch(err){
      alert ("Failed to update quantity");
    }
  };


  //remove item
  const removeItem = async (productId) => {
    try{
      await api.delete(`/cart/remove/${productId}`);
      fetchCart();
    // eslint-disable-next-line no-unused-vars
    } catch(err){
      alert("Failed to remove item");
    }
  };

  const navigate = useNavigate();
  const placeOrder = async () => {
    try {
      await api.post("/orders");
      alert("order placed successfully");
      navigate("/orders");
    // eslint-disable-next-line no-unused-vars
    } catch(err) {
      alert ("failed to place order");
    }
  };


  const totalAmount = cart.reduce(
    (sum,item)=> sum+item.product.price * item.quantity,0
  );

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Your Cart </h2>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.product._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <h4>{item.product.name}</h4>
              <p>₹{item.product.price}</p>

              <div>
                <button
                  onClick={() =>
                    updateQuantity(
                      item.product._id,
                      item.quantity - 1
                    )
                  }
                >
                  −
                </button>

                <span style={{ margin: "0 10px" }}>
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    updateQuantity(
                      item.product._id,
                      item.quantity + 1
                    )
                  }
                >
                  +
                </button>
              </div>

              <button
                style={{ marginTop: "10px", color: "red" }}
                onClick={() => removeItem(item.product._id)}
              >
                Remove 
              </button>
            </div>
          ))}

          <h3>Total: ₹{totalAmount}</h3>
          <button onClick={placeOrder}>
            Place Order 
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
