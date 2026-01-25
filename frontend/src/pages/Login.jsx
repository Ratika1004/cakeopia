import { useState} from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {useAuth} from "../context/AuthContext";

const Login = () => {
    const [ step ,setStep ] = useState(1); 
    const [ formData ,setFormData ] = useState({
        email : "" ,
        password : "" ,
    });
    const [ otp , setOtp ] = useState("");
    const [ loading , setLoading ] = useState(false);
    const [ error , setError ] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({...formData , [e.target.name] : e.target.value});
    };

    const handleLogin = async (e) =>{
        e.preventDefault();
        setLoading(true);
        setError("");

        try{
            const res = await api.post("/users/login" , formData);
            alert(res.data.message);
            setStep(2);
        } catch(err){
            setError (err.response?.data?.message || "login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try{
            const res = await api.post("/users/verify-login",{
                email : formData.email ,
                otp,
            });

            login(res.data.user , res.data.token);
            navigate("/products");
        }catch(err){
            setError(err.response?.data?.message || "OTP verification failed");
        } finally {
            setLoading(false);
        }
    };

    return(
        <div>
            <h2>Login</h2>
            {error && <p style={{color : "red"}} > {error}</p>}
            {step === 1 ? (
                <form onSubmit={handleLogin}>
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                    <button type="submit" disabled={loading}>
                        {loading ? "Sending OTP..." : "Login"}
                    </button>
                </form> ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <input type="text" placeholder="Enter OTP" value={otp} onChange={(e)=> setOtp(e.target.value)} required />
                        <button type="submit" disabled={loading} > 
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </form>
                )
}
        </div>
    )

}

export default Login;