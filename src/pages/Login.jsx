// Import React hook for managing state
import { useState } from "react";

// Import React Router hooks
import { useNavigate, useLocation } from "react-router-dom";

// Import Axios API instance
import api from "../api/axios";

// Import AuthContext hook
import { useAuth } from "../context/AuthContext";

// Import CSS
import "../styles/auth.css";


// Login component
const Login = () => {

  // Access login function from AuthContext
  const { login } = useAuth();

  // Router navigation
  const navigate = useNavigate();

  // Access router state
  const location = useLocation();

  // Success message from Register page
  const registerSuccessMessage = location.state?.message;


  // Form state
  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });

  // Error state
  const [error, setError] = useState("");

  // Loading state
  const [loading, setLoading] = useState(false);


  // Handle input changes
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  // Handle login submit
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);

    try {

      const res = await api.post("/auth/login", {

        email: formData.identifier,
        password: formData.password

      });

      login(res.data.token, res.data.user?.role || "user");

      navigate("/books", {
        state: { message: "Login successful" }
      });

    } catch (err) {

      setError(err.response?.data?.message || "Invalid email or password");

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="auth-page">

      <div className="auth-card">

        <h2>Login</h2>

        {registerSuccessMessage && (
          <p className="auth-success">
            {registerSuccessMessage}
          </p>
        )}

        {error && (
          <p className="auth-error">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <input
            name="identifier"
            type="email"
            placeholder="Email"
            value={formData.identifier}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
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
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

    </div>

  );

};


// THIS LINE IS THE IMPORTANT FIX
export default Login;
