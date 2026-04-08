// Import React hook used to store component state
import { useState } from "react";

// Import router utilities
import { Link, useNavigate } from "react-router-dom";

// Import authentication hook
import { useAuth } from "../context/AuthContext";

// Import navbar styles
import "../styles/navbar.css";


const Navbar = () => {

    /*
    -------------------------------------------------------
    AUTHENTICATION STATE
    -------------------------------------------------------
    */
    const { isAuth, logout } = useAuth();


    /*
    -------------------------------------------------------
    NAVIGATION HOOK
    -------------------------------------------------------
    */
    const navigate = useNavigate();


    /*
    -------------------------------------------------------
    MOBILE MENU STATE
    -------------------------------------------------------
    */
    const [menuOpen, setMenuOpen] = useState(false);


    /*
    Toggle hamburger menu
    */
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };


    /*
    Close mobile menu
    */
    const closeMenu = () => {
        setMenuOpen(false);
    };


    /*
    -------------------------------------------------------
    LOGOUT HANDLER
    -------------------------------------------------------
    */
    const handleLogout = () => {

        // Clear auth data
        logout();

        // Close mobile menu
        closeMenu();

        // Redirect to home page
        navigate("/");
    };


    return (

        <nav className="navbar">

            <div className="navbar-container">


                {/* BRAND LOGO */}
                <Link
                    to="/"
                    className="navbar-brand"
                    onClick={closeMenu}
                >
                    Book Management System
                </Link>


                {/* MOBILE HAMBURGER MENU */}
                <div
                    className={`hamburger ${menuOpen ? "active" : ""}`}
                    onClick={toggleMenu}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>


                {/* NAVIGATION LINKS */}
                <div
                    className={`navbar-links ${menuOpen ? "open" : ""}`}
                >

                    {/* Home visible to all */}
                    <Link
                        to="/"
                        className="nav-link"
                        onClick={closeMenu}
                    >
                        Home
                    </Link>


                    {/* Books visible only when logged in */}
                    {isAuth && (
                        <Link
                            to="/books"
                            className="nav-link"
                            onClick={closeMenu}
                        >
                            Books
                        </Link>
                    )}


                    {/* Authentication buttons */}
                    {!isAuth ? (

                        <>
                            {/* Login */}
                            <Link
                                to="/login"
                                className="btn btn-outline"
                                onClick={closeMenu}
                            >
                                Login
                            </Link>

                            {/* Register */}
                            <Link
                                to="/register"
                                className="btn btn-primary"
                                onClick={closeMenu}
                            >
                                Register
                            </Link>
                        </>

                    ) : (

                        /* Logout button */
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

export default Navbar;
