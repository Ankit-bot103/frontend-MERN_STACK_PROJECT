/*
======================================================
LOGIN PAGE
======================================================
Adds:
- Spinner
- Progress bar
- Success + error messages
*/

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const Login = () => {

  // Access login function from AuthContext
  const { login } = useAuth();

  // Router hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Message from registration redirect
  const successMessage = location.state?.message;

  // Form data state
  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });

  // Error message state
  const [error, setError] = useState("");

  // Loading state
  const [loading, setLoading] = useState(false);

  // Progress bar value
  const [progress, setProgress] = useState(0);


  /*
  Handle input changes
  */
  const handleChange = (e) => {

    setError("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  /*
  Handle login submit
  */
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);

    setProgress(30); // start progress


    try {

      const res = await api.post("/auth/login", {
        email: formData.identifier,
        password: formData.password
      });

      setProgress(70); // request succeeded


      // Save auth data
      login(res.data.token, res.data.user?.role || "user");

      setProgress(100);


      // Redirect to books page
      navigate("/books", {
        state: {
          message: "Login successful"
        }
      });

    } catch (err) {

      setError(err.response?.data?.message || "Invalid email or password");

      setProgress(0);

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="auth-page">

      <div className="auth-card">

        {/* Progress Bar */}
        {loading && (
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <h2>Login</h2>


        {/* Success message from registration */}
        {successMessage && (
          <p className="auth-success">
            {successMessage}
          </p>
        )}


        {/* Error message */}
        {error && (
          <p className="auth-error">
            {error}
          </p>
        )}


        <form onSubmit={handleSubmit}>

          {/* Email input */}
          <input
            name="identifier"
            type="email"
            placeholder="Email"
            value={formData.identifier}
            onChange={handleChange}
            autoComplete="off"
            required
          />

          {/* Password input */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />

          {/* Login button */}
          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
          >

            {loading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}

          </button>

        </form>

      </div>

    </div>

  );

};

export default Login;
