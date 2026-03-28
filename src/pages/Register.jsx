```javascript
// Import React hook for managing component state
import { useState } from "react";

// Import React Router hook used to navigate between pages
import { useNavigate } from "react-router-dom";

// Import configured Axios instance for making API requests
import api from "../api/axios";

// Import CSS styles used for authentication pages
import "../styles/auth.css";


// Define the Register component
const Register = () => {

  // React Router navigation function
  // Used to redirect user after successful registration
  const navigate = useNavigate();


  // Form state storing user input values
  // username → selected username
  // email → user email address
  // password → user password
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });


  // State used to store error messages returned by backend
  const [error, setError] = useState("");


  // Loading state used to disable the button during API call
  const [loading, setLoading] = useState(false);


  // Function triggered whenever input field value changes
  const handleChange = (e) => {

    // Update the specific field while keeping other values intact
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  // Function triggered when registration form is submitted
  const handleSubmit = async (e) => {

    // Prevent default form submission behavior
    e.preventDefault();

    // Clear previous error messages
    setError("");

    // Enable loading state
    setLoading(true);

    try {

      // Send registration request to backend API
      // Endpoint: POST /auth/register
      await api.post("/auth/register", formData);


      // Redirect user to Login page
      // Pass success message using React Router state
      navigate("/login", {
        state: {
          message: "Registration successful. Please login."
        }
      });

    } catch (err) {

      // If backend returns error message show it
      // Otherwise show generic error message
      setError(err.response?.data?.message || "Registration failed");

    } finally {

      // Disable loading state after request finishes
      setLoading(false);

    }
  };


  // JSX returned by the component
  return (

    // Main authentication page container
    <div className="auth-page">

      {/* Card container for register form */}
      <div className="auth-card">

        {/* Page title */}
        <h2>Register</h2>


        {/* Display error message if registration fails */}
        {error && (
          <p className="auth-error">
            {error}
          </p>
        )}


        {/* Registration form */}
        <form onSubmit={handleSubmit}>

          {/* Username input field */}
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />


          {/* Email input field */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />


          {/* Password input field */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />


          {/* Register button */}
          {/* Disabled while API request is processing */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >

            {/* Change button text during loading */}
            {loading ? "Registering..." : "Register"}

          </button>

        </form>

      </div>

    </div>

  );
};


// Export Register component so it can be used in routing
export default Register;
```
