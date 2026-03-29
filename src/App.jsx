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


// Import React Router components used for defining routes
import { Routes, Route } from "react-router-dom";


// Import page components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Books from "./pages/Books";


// Import components used for authentication protection
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

This is the root React component rendered by main.jsx.

Responsibilities:
1. Render Navbar globally
2. Apply dashboard layout
3. Define application routes
4. Protect authenticated routes
*/
const App = () => {

  /*
  JSX returned by App component
  */
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


        {/* Sidebar navigation */}
        <Sidebar />


        {/* Main content area where pages render */}
        <main className="dashboard-content">


          {/* --------------------------------------------------
             ROUTE DEFINITIONS
             --------------------------------------------------

             Each Route maps a URL path to a component
          */}
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

                  {/* Books page component */}
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
