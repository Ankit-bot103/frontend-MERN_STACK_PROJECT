// Import React hook for managing component state
import { useState } from "react";

// Import React Router navigation hook
import { useNavigate } from "react-router-dom";

// Import Axios API instance
import api from "../api/axios";

// Import authentication styles
import "../styles/auth.css";


// Register component
const Register = () => {

  // Navigation function
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  // Error state
  const [error, setError] = useState("");

  // Loading state
  const [loading, setLoading] = useState(false);


  // Handle input change
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  // Handle form submit
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);

    try {

      await api.post("/auth/register", formData);

      // Redirect to login with success message
      navigate("/login", {
        state: {
          message: "Registration successful. Please login."
        }
      });

    } catch (err) {

      setError(err.response?.data?.message || "Registration failed");

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="auth-page">

      <div className="auth-card">

        <h2>Register</h2>

        {error && (
          <p className="auth-error">{error}</p>
        )}

        <form onSubmit={handleSubmit}>

          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

      </div>

    </div>

  );

};


// IMPORTANT: default export required by App.jsx
export default Register;
