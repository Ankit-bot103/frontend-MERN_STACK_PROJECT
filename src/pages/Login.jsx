```javascript
// Import React hook used to manage component state
import { useState } from "react";

// Import React Router hooks
// useNavigate → used to redirect user after login
// useLocation → used to read messages passed from previous page
import { useNavigate, useLocation } from "react-router-dom";

// Import Axios API instance configured with backend base URL
import api from "../api/axios";

// Import authentication context hook
// This allows storing JWT token and role globally
import { useAuth } from "../context/AuthContext";

// Import shared CSS styles for authentication pages
import "../styles/auth.css";


// Functional component representing the Login page
const Login = () => {

  // Extract login function from AuthContext
  // This function saves token and role globally
  const { login } = useAuth();

  // React Router navigation function
  // Used to redirect user after successful login
  const navigate = useNavigate();

  // Access location object to read messages passed from previous page
  const location = useLocation();

  // Success message passed from Register page
  const registerSuccessMessage = location.state?.message;


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


  // Error message state used to display login errors
  const [error, setError] = useState("");


  // Loading state used to disable button during API request
  const [loading, setLoading] = useState(false);


  /*
    --------------------------------------------------
    INPUT CHANGE HANDLER
    --------------------------------------------------
    Updates formData dynamically when user types
  */
  const handleChange = (e) => {

    // Update specific field while preserving other values
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
    - Save JWT token in AuthContext
    - Redirect to Books page

    On failure:
    - Show error message
  */
  const handleSubmit = async (e) => {

    // Prevent default browser form submission behavior
    e.preventDefault();

    // Clear previous error message
    setError("");

    // Enable loading state
    setLoading(true);

    try {

      // Send login request to backend API
      const res = await api.post("/auth/login", {

        // Send email from identifier field
        email: formData.identifier,

        // Send password entered by user
        password: formData.password
      });


      // Store JWT token and role globally using AuthContext
      login(res.data.token, res.data.user?.role || "user");


      // Redirect user to Books page with success message
      navigate("/books", {
        state: {
          message: "Login successful"
        }
      });

    } catch (err) {

      // Display backend error message if available
      // Otherwise show default login error message
      setError(err.response?.data?.message || "Invalid email or password");

    } finally {

      // Disable loading state after API call finishes
      setLoading(false);

    }
  };


  /*
    ==================================================
    JSX UI RENDER
    ==================================================
  */
  return (

    // Main authentication page container
    <div className="auth-page">

      {/* Card container for login form */}
      <div className="auth-card">

        {/* Page title */}
        <h2>Login</h2>


        {/* Show success message if redirected from Register page */}
        {registerSuccessMessage && (
          <p className="auth-success">
            {registerSuccessMessage}
          </p>
        )}


        {/* Display login error if authentication fails */}
        {error && (
          <p className="auth-error">
            {error}
          </p>
        )}


        {/* Login form */}
        <form onSubmit={handleSubmit}>

          {/* Email input field */}
          <input
            name="identifier"
            type="email"
            placeholder="Email"
            value={formData.identifier}
            onChange={handleChange}
            required
          />


          {/* Password input field */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />


          {/* Submit button */}
          {/* Disabled when loading is true */}
          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
          >

            {/* Button text changes during API request */}
            {loading ? "Logging in..." : "Login"}

          </button>

        </form>

      </div>

    </div>

  );
};


// Export Login component so it can be used in routing
export default Login;
```
