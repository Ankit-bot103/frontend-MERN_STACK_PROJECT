// Login page component responsible for authenticating users and issuing JWT tokens

// React hook for managing form state
import { useState } from "react";

// React Router hook for programmatic navigation
import { useNavigate } from "react-router-dom";

// Axios instance for backend API calls
import api from "../api/axios";

// Custom authentication context hook
import { useAuth } from "../context/AuthContext";

// Shared authentication page styles
import "../styles/auth.css";

// Functional component for Login page
const Login = () => {
  // Get login function from AuthContext
  const { login } = useAuth();

  // Used to redirect user after successful login
  const navigate = useNavigate();

  /*
    --------------------------------------------------
    FORM STATE
    --------------------------------------------------
    identifier → email entered by user
    password   → user password
  */
  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });

  // Error message state (shown on invalid login)
  const [error, setError] = useState("");

  /*
    --------------------------------------------------
    INPUT CHANGE HANDLER
    --------------------------------------------------
    Updates formData dynamically based on input name
  */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /*
    ==================================================
    FORM SUBMIT HANDLER
    ==================================================
    API: POST /auth/login

    On success:
    - Save JWT token & role in AuthContext
    - Redirect user to Books page

    On failure:
    - Show error message
  */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setError("");       // Clear previous errors

    try {
      // Send login request to backend
      const res = await api.post("/auth/login", {
        email: formData.identifier,
        password: formData.password
      });

      // Store token and role globally using AuthContext
      login(res.data.token, res.data.user?.role || "user");

      // Redirect to Books page after successful login
      navigate("/books");
    } catch (err) {
      // Display backend error or fallback message
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  /*
    ==================================================
    JSX UI RENDER
    ==================================================
  */
  return (
    // Full-page centered authentication layout
    <div className="auth-page">
      <div className="auth-card">

        {/* Page heading */}
        <h2>Login</h2>

        {/* Error message (shown only if error exists) */}
        {error && <p className="auth-error">{error}</p>}

        {/* Login form */}
        <form onSubmit={handleSubmit}>

          {/* Email input */}
          <input
            name="identifier"
            type="email"
            placeholder="Email"
            value={formData.identifier}
            onChange={handleChange}
            required
          />

          {/* Password input */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Submit button */}
          <button className="btn btn-primary" type="submit">
            Login
          </button>

        </form>
      </div>
    </div>
  );
};

// Export Login component for routing
export default Login;
