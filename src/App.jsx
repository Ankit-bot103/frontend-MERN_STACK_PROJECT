/*
======================================================
APPLICATION ROOT (ROUTING + DASHBOARD LAYOUT)
======================================================
File: src/App.jsx

Purpose:
- Define all application routes
- Apply dashboard layout (Navbar + Sidebar + Content)
- Protect routes that require authentication

Concepts Used:
- React Router v6
- Protected routes
- Layout composition
*/


// Import React Router components
import { Routes, Route, useLocation } from "react-router-dom";


// Import page components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Books from "./pages/Books";


// Import authentication protection wrapper
import ProtectedRoute from "./components/ProtectedRoute";


// Import UI layout components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";


// Import dashboard layout styles
import "./styles/dashboard.css";


/*
======================================================
APP COMPONENT
======================================================

Responsibilities:
1. Render Navbar globally
2. Show Sidebar only for authenticated pages
3. Define application routes
4. Protect routes that require authentication
*/
const App = () => {

  /*
  Detect current route
  */
  const location = useLocation();


  /*
  Define public routes where sidebar should not appear
  */
  const publicRoutes = ["/", "/login", "/register"];


  /*
  Check if sidebar should be hidden
  */
  const hideSidebar = publicRoutes.includes(location.pathname);


  return (

    /*
    Root layout container
    */
    <div className="app-layout">


      {/* --------------------------------------------------
         GLOBAL NAVBAR
         --------------------------------------------------

         Visible on every page across the application.
      */}
      <Navbar />


      {/* --------------------------------------------------
         DASHBOARD BODY
         --------------------------------------------------

         Contains:
         - Sidebar navigation
         - Main page content
      */}
      <div className="dashboard-container">


        {/* Sidebar only appears after login */}
        {!hideSidebar && <Sidebar />}


        {/* Main content area where pages render */}
        <main className="dashboard-content">


          {/* --------------------------------------------------
             ROUTE DEFINITIONS
             -------------------------------------------------- */}
          <Routes>


            {/* ---------------- PUBLIC ROUTES ---------------- */}

            {/* Home page */}
            <Route path="/" element={<Home />} />


            {/* Login page */}
            <Route path="/login" element={<Login />} />


            {/* Register page */}
            <Route path="/register" element={<Register />} />


            {/* ---------------- PROTECTED ROUTES ---------------- */}

            {/* Books page (requires authentication) */}
            <Route
              path="/books"
              element={
                <ProtectedRoute>
                  <Books />
                </ProtectedRoute>
              }
            />


          </Routes>

        </main>

      </div>

    </div>

  );
};


/*
Export App component so main.jsx can render it
*/
export default App;
