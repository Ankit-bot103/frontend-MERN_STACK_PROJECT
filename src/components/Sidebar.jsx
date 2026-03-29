/*
======================================================
SIDEBAR COMPONENT
======================================================
File: src/components/Sidebar.jsx

Purpose:
- Provide dashboard navigation
- Display links to main pages
- Highlight active page
- Show navigation only when user is authenticated

Used in:
src/App.jsx

Concepts Used:
- React Router navigation
- Authentication context
- Conditional rendering
*/


// Import NavLink for navigation with active link highlighting
import { NavLink } from "react-router-dom";

// Import authentication context
// Used to check if user is logged in
import { useAuth } from "../context/AuthContext";

// Import sidebar styles
import "../styles/dashboard.css";



/*
======================================================
SIDEBAR COMPONENT
======================================================
*/
const Sidebar = () => {

  /*
  Access authentication state
  */
  const { isAuth } = useAuth();


  /*
  If user is NOT authenticated
  we do not display the sidebar
  */
  if (!isAuth) {
    return null;
  }


  /*
  Sidebar UI
  */
  return (

    <aside className="sidebar">


      {/* Sidebar title */}
      <h3 className="sidebar-title">
        Dashboard
      </h3>


      {/* Navigation menu */}
      <nav className="sidebar-nav">


        {/* Home link */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Home
        </NavLink>


        {/* Books page link */}
        <NavLink
          to="/books"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Books
        </NavLink>


      </nav>

    </aside>

  );

};


/*
Export sidebar component
*/
export default Sidebar;
