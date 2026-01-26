import { useEffect, useState } from "react";
import api from "../api/axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my");
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  };

  const statusBadge = (status) => {
    let bgColor = "#f0ad4e"; // pending
    if (status === "confirmed") bgColor = "#4caf50";
    if (status === "delivered") bgColor = "#1e88e5";
    if (status === "cancelled") bgColor = "#f56565";

    return {
      backgroundColor: bgColor,
      color: "#fff",
      padding: "4px 10px",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: "500",
      textTransform: "capitalize",
    };
  };

  const dateStyle = {
    color: "#777",
    fontSize: "14px",
    marginBottom: "10px",
  };

  const itemStyle = {
    fontSize: "16px",
    margin: "5px 0",
  };

  const totalStyle = {
    marginTop: "10px",
    fontWeight: "600",
    fontSize: "18px",
    color: "#ff6b6b",
  };
  // ---------------------------------------------

  if (loading) return <p style={{ textAlign: "center" }}>Loading orders...</p>;
  if (orders.length === 0)
    return <p style={{ textAlign: "center" }}>You have no orders yet.</p>;

  return (
    <div style={pageStyle}>
      <h2 style={headingStyle}>My Orders</h2>

      <div style={gridStyle}>
        {orders.map((order) => (
          <div key={order._id} style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Status:</span>
              <span style={statusBadge(order.status)}>{order.status}</span>
            </div>

            <p style={dateStyle}>
              Ordered on: {new Date(order.createdAt).toLocaleDateString()}
            </p>

            <hr />

            <div>
              {order.items.map((item, index) => (
                <p key={index} style={itemStyle}>
                  {item.name} × {item.quantity}
                </p>
              ))}
            </div>

            <p style={totalStyle}>Total: ₹{order.totalAmount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
