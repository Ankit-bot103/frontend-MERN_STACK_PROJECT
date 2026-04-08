import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";   // added Link
import api from "../api/axios";
import "../styles/auth.css";

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setError("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      await api.post("/auth/register", formData);

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
          <p className="auth-error">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            autoComplete="off"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>

        </form>

        {/* Added login link for better user flow */}
        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login">Login here</Link>
        </p>

      </div>

    </div>

  );

};

export default Register;
