// Import React hook used to store component state
// We use this to control the mobile hamburger menu open/close
import { useState } from "react";

// Import Link for client-side navigation (prevents full page reload)
// Import useNavigate for redirecting users programmatically
import { Link, useNavigate } from "react-router-dom";

// Import custom authentication hook
// useAuth gives access to authentication state and logout function
import { useAuth } from "../context/AuthContext";

// Import navbar-specific CSS styles
import "../styles/navbar.css";


// Navbar component definition
const Navbar = () => {

    /*
    -------------------------------------------------------
    AUTHENTICATION STATE
    -------------------------------------------------------
    isAuth → Boolean that tells if the user is logged in
    logout → Function used to clear authentication data
    */
    const { isAuth, logout } = useAuth();


    /*
    -------------------------------------------------------
    NAVIGATION HOOK
    -------------------------------------------------------
    Allows redirecting users using JavaScript
    Example: navigate("/login")
    */
    const navigate = useNavigate();


    /*
    -------------------------------------------------------
    MOBILE MENU STATE
    -------------------------------------------------------
    menuOpen → true if hamburger menu is expanded
    false → mobile menu hidden
    */
    const [menuOpen, setMenuOpen] = useState(false);


    /*
    -------------------------------------------------------
    TOGGLE MOBILE MENU
    -------------------------------------------------------
    When hamburger icon is clicked:
    - If menu closed → open it
    - If menu open → close it
    */
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };


    /*
    -------------------------------------------------------
    CLOSE MOBILE MENU
    -------------------------------------------------------
    Used when user clicks any navigation link
    Improves mobile UX
    */
    const closeMenu = () => {
        setMenuOpen(false);
    };


    /*
    -------------------------------------------------------
    LOGOUT HANDLER
    -------------------------------------------------------
    Steps:
    1. Clear authentication state
    2. Close mobile menu
    3. Redirect user to login page
    */
    const handleLogout = () => {

        // Clear authentication data
        logout();

        // Close mobile menu
        closeMenu();

        // Redirect user to login page
        navigate("/login");
    };


    /*
    -------------------------------------------------------
    JSX UI STRUCTURE
    -------------------------------------------------------
    Navbar Layout

    Desktop:
    Logo | Home | Books | Login/Register OR Logout

    Mobile:
    Logo | ☰
    ↓
    Home
    Books
    Login/Register OR Logout
    */
    return (

        // Main navigation bar container
        <nav className="navbar">

            {/* Container used for layout alignment */}
            <div className="navbar-container">


                {/* --------------------------------------------------
                   BRAND / LOGO
                -------------------------------------------------- */}
                <Link
                    to="/"
                    className="navbar-brand"

                    // Close mobile menu when clicking logo
                    onClick={closeMenu}
                >
                    Book Management System
                </Link>


                {/* --------------------------------------------------
                   HAMBURGER MENU (MOBILE ONLY)
                -------------------------------------------------- */}
                <div
                    className={`hamburger ${menuOpen ? "active" : ""}`}

                    // Toggle menu when clicked
                    onClick={toggleMenu}
                >

                    {/* Hamburger bars */}
                    <span></span>
                    <span></span>
                    <span></span>

                </div>


                {/* --------------------------------------------------
                   NAVIGATION LINKS
                -------------------------------------------------- */}
                <div
                    className={`navbar-links ${menuOpen ? "open" : ""}`}
                >

                    {/* Home link visible to all users */}
                    <Link
                        to="/"
                        className="nav-link"
                        onClick={closeMenu}
                    >
                        Home
                    </Link>


                    {/* --------------------------------------------------
                       BOOKS LINK
                       Visible only when user is authenticated
                    -------------------------------------------------- */}
                    {isAuth && (
                        <Link
                            to="/books"
                            className="nav-link"
                            onClick={closeMenu}
                        >
                            Books
                        </Link>
                    )}


                    {/* --------------------------------------------------
                       AUTHENTICATION BUTTONS
                    -------------------------------------------------- */}

                    {/* If user NOT logged in show Login/Register */}
                    {!isAuth ? (

                        <>
                            {/* Login button */}
                            <Link
                                to="/login"
                                className="btn btn-outline"
                                onClick={closeMenu}
                            >
                                Login
                            </Link>

                            {/* Register button */}
                            <Link
                                to="/register"
                                className="btn btn-primary"
                                onClick={closeMenu}
                            >
                                Register
                            </Link>
                        </>

                    ) : (

                        /* If logged in show Logout button */
                        <button
                            className="btn btn-logout"

                            // Call logout handler
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


// Export Navbar so it can be used inside App.jsx
export default Navbar;
