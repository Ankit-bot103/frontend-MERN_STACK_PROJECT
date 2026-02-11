/*
  ======================================================
  APPLICATION ENTRY POINT
  ======================================================
  File: src/main.jsx

  Purpose:
  - Entry point of the React application
  - Mounts React to the DOM
  - Wraps the app with required global providers

  Key Concepts:
  - React 18 root API
  - Context Provider
  - React Router
*/


// ReactDOM is used to render the React app into the DOM
import ReactDOM from "react-dom/client";

// BrowserRouter enables client-side routing (SPA behavior)
import { BrowserRouter } from "react-router-dom";

// Root App component
import App from "./App";

// Authentication context provider (JWT + auth state)
import { AuthProvider } from "./context/AuthContext";


/*
  ======================================================
  RENDERING THE APPLICATION
  ======================================================
  ReactDOM.createRoot creates a React 18 root
  The app is rendered inside the <div id="root"></div>
  present in index.html
*/
ReactDOM.createRoot(document.getElementById("root")).render(

  /*
    --------------------------------------------------
    BROWSER ROUTER
    --------------------------------------------------
    Enables:
    - Route-based navigation
    - URL-based rendering
    - SPA behavior without page reloads
  */
  <BrowserRouter>

    {/*
      ----------------------------------------------
      AUTH PROVIDER
      ----------------------------------------------
      Makes authentication state available
      throughout the entire app:
      - token
      - role
      - isAuth
      - login / logout methods
    */}
    <AuthProvider>

      {/* Root application component */}
      <App />

    </AuthProvider>
  </BrowserRouter>
);
