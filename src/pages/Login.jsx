import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const Login = () => {

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.message;

  const [formData, setFormData] = useState({
    identifier: "",
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

      const res = await api.post("/auth/login", {
        email: formData.identifier,
        password: formData.password
      });

      login(res.data.token, res.data.user?.role || "user");

      navigate("/books", {
        state: {
          message: "Login successful"
        }
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

        {successMessage && (
          <p className="auth-success">
            {successMessage}
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
            autoComplete="off"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />

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
