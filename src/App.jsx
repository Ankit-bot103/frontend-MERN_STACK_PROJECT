/*
  ======================================================
  APPLICATION ROOT (ROUTING CONFIGURATION)
  ======================================================
  File: src/App.jsx

  Purpose:
  - Defines all application routes
  - Controls public vs protected pages
  - Renders the Navbar globally

  Key Concepts Used:
  - React Router v6
  - Protected Routes (Authentication)
  - Component-based routing
*/


// React Router components for routing
import { Routes, Route } from "react-router-dom";

// Page components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Books from "./pages/Books";

// Higher-order components
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";


/*
  ======================================================
  APP COMPONENT
  ======================================================
  This is the root component rendered by main.jsx.

  Responsibilities:
  - Display Navbar on every page
  - Define application routes
  - Protect routes that require authentication
*/
const App = () => {
  return (
    <>
      {/* --------------------------------------------------
          GLOBAL NAVBAR
          --------------------------------------------------
          Visible on ALL pages (public & protected)
      */}
      <Navbar />

      {/* --------------------------------------------------
          ROUTE DEFINITIONS
          --------------------------------------------------
          Each <Route> maps a URL path to a component
      */}
      <Routes>

        {/* ---------------- PUBLIC ROUTES ---------------- */}

        {/* Home page (landing page) */}
        <Route path="/" element={<Home />} />

        {/* Authentication pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* ---------------- PROTECTED ROUTES ---------------- */}

        {/* 
          Books page
          - Wrapped with <ProtectedRoute>
          - Only accessible if user is authenticated
        */}
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <Books />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
};

export default App;
