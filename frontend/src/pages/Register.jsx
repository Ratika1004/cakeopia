import {useState} from 'react';
import api from "../../src/api/axios";

const Register = () => {
    const [formData , setFormData] = useState ( {
        name : "" ,
        email : "" ,
        password : "" ,
    });

    const [loading , setLoading ] = useState (false);
    const [error , setError] = useState ("");

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
            await api.post("/users/register" , formData);
            alert ( "Registration successful !");
        } catch (err) {
            setError ( err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return ( 
        <div>
            <h2>Register</h2>

            {error && <p style={{ color : "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                     type="text" name="name" placeholder='Name' value={formData.name} onChange={handleChange} required />
                <input 
                    type='email' name='email' placeholder='Email' value={formData.email} onChange={handleChange} required />
                <input 
                type='password' name='password' placeholder='Password' value={formData.password} onChange={handleChange} required />

                <button type='submit' disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
             </form>
        </div>
    )
};

export default Register;