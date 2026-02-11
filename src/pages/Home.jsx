// Home page component that introduces the Book Management System project

// Import CSS styles specific to the Home (Hero) page
import "../styles/home.css";

// Functional component for Home page
const Home = () => {
  return (
    // Main hero container that centers content on the page
    <div className="hero-container">

      {/* Card-style container for hero content */}
      <div className="hero-card">

        {/* Main heading of the application */}
        <h1 className="hero-title">
          Book Management System
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

        {/* Footer text prompting user action */}
        <p className="hero-footer">
          Login to start managing books
        </p>

      </div>
    </div>
  );
};

// Export Home component so it can be used in routing
export default Home;
