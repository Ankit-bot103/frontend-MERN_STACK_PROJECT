// Import Navigate component from react-router-dom
// Navigate is used to redirect users programmatically
import { Navigate } from "react-router-dom";

// Import custom authentication hook
// Provides auth state like isAuth and user role
import { useAuth } from "../context/AuthContext";

// ProtectedRoute is a wrapper component
// It controls access to routes based on authentication and roles
const ProtectedRoute = ({ children, allowedRoles }) => {

  // Destructure authentication state from AuthContext
  // isAuth → true if user is logged in
  // role → user's role (e.g., "admin", "student")
  const { isAuth, role } = useAuth();

  /**
   * STEP 1: Authentication Check
   * If user is NOT authenticated,
   * redirect them to the login page
   */
  if (!isAuth) return <Navigate to="/login" />;

  /**
   * STEP 2: Authorization Check (Role-Based Access)
   *
   * - allowedRoles is optional
   * - If provided, check whether user's role is permitted
   * - Example:
   *   allowedRoles = ["admin"]
   */
  if (allowedRoles && !allowedRoles.includes(role)) {
    // User is logged in but does not have required permissions
    return <h3>Access Denied</h3>;
  }

  /**
   * STEP 3: Access Granted
   * If authentication and authorization checks pass,
   * render the protected component
   */
  return children;
};

// Export ProtectedRoute for usage in routing configuration
export default ProtectedRoute;
