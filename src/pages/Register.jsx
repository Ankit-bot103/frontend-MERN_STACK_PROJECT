// Registration page component responsible for creating new users in the system

// React hook for managing form and UI state
import { useState } from "react";

// React Router hook for navigation after registration
import { useNavigate } from "react-router-dom";

// Axios instance for backend API communication
import api from "../api/axios";

// Shared authentication page styles
import "../styles/auth.css";

// Functional component for Register page
const Register = () => {
  // Used to redirect user after successful registration
  const navigate = useNavigate();

  /*
    --------------------------------------------------
    FORM STATE
    --------------------------------------------------
    username → chosen username
    email    → user email
    password → account password
  */
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  // Error message shown when registration fails
  const [error, setError] = useState("");

  // Loading indicator to prevent multiple submissions
  const [loading, setLoading] = useState(false);

  /*
    --------------------------------------------------
    INPUT CHANGE HANDLER
    --------------------------------------------------
    Dynamically updates formData based on input name
  */
  const handleChange = (e) => {
    setFormData({
      ...formData,               // Preserve existing values
      [e.target.name]: e.target.value // Update changed field
    });
  };

  /*
    ==================================================
    FORM SUBMIT HANDLER
    ==================================================
    API: POST /auth/register

    On success:
    - Redirect user to Login page

    On failure:
    - Display backend validation error
  */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setError("");       // Clear previous error
    setLoading(true);   // Disable button & show loading state

    try {
      // Send registration data to backend
      // await api.post("/auth/register", formData);
      await api.post("/api/auth/register", formData);


      // Redirect user to login page after successful registration
      navigate("/login");
    } catch (err) {
      // Display backend error message or fallback text
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      // Re-enable button after request completes
      setLoading(false);
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
        <h2>Register</h2>

        {/* Error message (shown only if error exists) */}
        {error && <p className="auth-error">{error}</p>}

        {/* Registration form */}
        <form onSubmit={handleSubmit}>

          {/* Username input */}
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          {/* Email input */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Password input */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Submit button (disabled while loading) */}
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

// Export Register component for routing
export default Register;
