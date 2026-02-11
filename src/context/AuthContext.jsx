// Import React hooks needed for context and state management
import { createContext, useContext, useEffect, useState } from "react";

/*
  ======================================================
  AUTH CONTEXT
  ======================================================
  This file manages:
  - Authentication state (logged in / logged out)
  - JWT token storage
  - User role (admin / user)
  - Global access to auth data across the app
*/

// Create a new Context object
// This will hold authentication-related data
const AuthContext = createContext(null);

/*
  ======================================================
  AUTH PROVIDER COMPONENT
  ======================================================
  This component wraps the entire application
  and provides authentication data to all child components
*/
export const AuthProvider = ({ children }) => {
  // Read token and role from localStorage (persisted login)
  // This allows users to stay logged in after page refresh
  const storedToken = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");

  // State to store JWT token
  const [token, setToken] = useState(storedToken);

  // State to store user role (admin / user)
  const [role, setRole] = useState(storedRole);

  // Boolean flag to indicate authentication status
  // !! converts value to true/false
  const [isAuth, setIsAuth] = useState(!!storedToken);

  /*
    ------------------------------------------------------
    LOGIN FUNCTION
    ------------------------------------------------------
    Called after successful login API response
    - Stores token & role in localStorage
    - Updates React state
  */
  const login = (jwtToken, userRole) => {
    // Persist values in browser storage
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("role", userRole);

    // Update React state
    setToken(jwtToken);
    setRole(userRole);
    setIsAuth(true);
  };

  /*
    ------------------------------------------------------
    LOGOUT FUNCTION
    ------------------------------------------------------
    Called when user clicks Logout
    - Clears localStorage
    - Resets authentication state
  */
  const logout = () => {
    // Remove stored auth data
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Reset state
    setToken(null);
    setRole(null);
    setIsAuth(false);
  };

  /*
    ------------------------------------------------------
    SYNC AUTH STATE ON PAGE REFRESH
    ------------------------------------------------------
    Runs once when component mounts
    Ensures authentication state remains correct
  */
  useEffect(() => {
    if (storedToken) {
      setIsAuth(true);
    }
  }, [storedToken]);

  /*
    ------------------------------------------------------
    CONTEXT PROVIDER
    ------------------------------------------------------
    Exposes auth-related data & functions
    to the entire application
  */
  return (
    <AuthContext.Provider
      value={{
        token,      // JWT token (used by Axios)
        role,       // User role (admin / user)
        isAuth,     // Authentication status
        login,      // Login handler
        logout      // Logout handler
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/*
  ======================================================
  CUSTOM HOOK: useAuth
  ======================================================
  Makes it easy to access auth data in any component
  Example:
    const { isAuth, login, logout } = useAuth();
*/
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Safety check: ensures hook is used inside AuthProvider
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
