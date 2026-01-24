import { useState } from "react";
import {useNavigate} from "react-router-dom";
import api from "../../src/api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [formData , setFormData] = useState ({
        email : "",
        password : "",
    });

    const [loading , setLoading ] = useState (false);
    const [error , setError] = useState ("");

    const {login} = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData ( {
            ...formData ,
            [e.target.name] : e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError ("");
        setLoading (true);

        try {
            const res= await api.post("/users/login" , formData);
            login (res.data.user , res.data.token);
            navigate ("/products");
            console.log("logged in");
        } catch (err) {
            setError ( err.response?.data?.message || "login failed");
        } finally {
            setLoading(false);
        }};

    return (
        <div>
            <h2> login </h2>
            {error && <p style={{ color : "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input
                    type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    )
};

export default Login;