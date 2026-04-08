// Home page component that introduces the Book Management System project

// Import CSS styles specific to the Home (Hero) page
import "../styles/home.css";

// Import Link for navigation
import { Link } from "react-router-dom";

// Functional component for Home page
const Home = () => {
  return (
    // Main hero container that centers content on the page
    <div className="hero-container">

      {/* Card-style container for hero content */}
      <div className="hero-card">

        {/* Main heading of the application */}
        <h1 className="hero-title">
          Welcome to Book Management System 📚
        </h1>

        {/* Short description explaining what the project is */}
        <p className="hero-subtitle">
          A full-stack web application built using React, Node.js, Express, and MongoDB.
        </p>

        {/* Grid layout to display Features and Tech Stack side-by-side */}
        <div className="hero-grid">

          {/* Features section */}
          <div>
            <h3>Features</h3>
            <ul>
              <li>User Authentication (JWT)</li>
              <li>Add / Edit / Delete Books</li>
              <li>Pagination & Search</li>
              <li>Protected Routes</li>
              <li>Role-ready Backend</li>
            </ul>
          </div>

          {/* Technology stack section */}
          <div>
            <h3>Tech Stack</h3>
            <ul>
              <li><strong>Frontend:</strong> React + Axios</li>
              <li><strong>Backend:</strong> Node.js + Express</li>
              <li><strong>Database:</strong> MongoDB + Mongoose</li>
              <li><strong>Auth:</strong> JWT</li>
            </ul>
          </div>

        </div>

        {/* New onboarding message for users */}
        <p className="hero-footer">
          New users must <strong>register first</strong>, then login to manage books.
        </p>

        {/* Action buttons for Register and Login */}
        <div style={{ marginTop: "20px" }}>

          <Link to="/register">
            <button className="auth-btn">
              Register
            </button>
          </Link>

          <Link to="/login">
            <button className="auth-btn" style={{ marginLeft: "10px" }}>
              Login
            </button>
          </Link>

        </div>

      </div>
    </div>
  );
};

// Export Home component so it can be used in routing
export default Home;
