// Import Link for client-side navigation (no page reload)
// Import useNavigate for programmatic redirection
import { Link, useNavigate } from "react-router-dom";

// Import custom authentication hook
// useAuth gives access to auth state and actions
import { useAuth } from "../context/AuthContext";

// Import navbar-specific CSS styles
import "../styles/navbar.css";

// Navbar is a functional React component
const Navbar = () => {

    // Destructure authentication state and logout function
    // isAuth → true if user is logged in
    // logout → clears auth state and tokens
    const { isAuth, logout } = useAuth();

    // useNavigate allows redirecting users using JavaScript
    const navigate = useNavigate();

    /**
     * Handle Logout Button Click
     * 1. Call logout() to clear authentication data
     * 2. Redirect user to login page
     */
    const handleLogout = () => {
        logout();              // Clear auth state (token, role, user info)
        navigate("/login");    // Redirect to login page
    };

    // JSX returned by Navbar component
    return (
        // Main navigation wrapper
        <nav className="navbar">
            <div className="navbar-container">

                {/* =========================
                    Brand / Logo Section
                   ========================= */}
                <Link to="/" className="navbar-brand">
                    Book Management System
                </Link>

                {/* =========================
                    Navigation Links
                   ========================= */}
                <div className="navbar-links">

                    {/* Home link is always visible */}
                    <Link to="/" className="nav-link">
                        Home
                    </Link>

                    {/* 
                        Show "Books" link ONLY when user is authenticated
                        Conditional rendering using && operator
                    */}
                    {isAuth && (
                        <Link to="/books" className="nav-link">
                            Books
                        </Link>
                    )}

                    {/* 
                        Conditional Rendering using Ternary Operator
                        If user is NOT authenticated → show Login & Register
                        If user IS authenticated → show Logout button
                    */}
                    {!isAuth ? (
                        <>
                            {/* Login button */}
                            <Link to="/login" className="btn btn-outline">
                                Login
                            </Link>

                            {/* Register button */}
                            <Link to="/register" className="btn btn-primary">
                                Register
                            </Link>
                        </>
                    ) : (
                        // Logout button (visible only when logged in)
                        <button
                            className="btn btn-logout"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

// Export Navbar so it can be used in App.jsx
export default Navbar;
