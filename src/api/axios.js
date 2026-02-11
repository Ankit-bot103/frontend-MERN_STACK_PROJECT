// Import axios library for making HTTP requests (GET, POST, PUT, DELETE)
import axios from "axios";

/**
 * Create a reusable Axios instance
 * This avoids repeating base URL and interceptors everywhere
 *
 * import.meta.env.VITE_API_BASE_URL
 * → Reads environment variable from Vite (.env file)
 * Example:
 * VITE_API_BASE_URL = http://localhost:8800/api
 */
const api = axios.create({
  // Base URL that will be prefixed to all API requests
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

/**
 * ============================
 * REQUEST INTERCEPTOR
 * ============================
 * This runs BEFORE every API request is sent to backend
 *
 * Purpose:
 * 1. Fetch JWT token from browser storage
 * 2. Attach token to request headers
 * 3. Enable protected API access
 */
api.interceptors.request.use(
  // config contains request details (URL, headers, body, etc.)
  (config) => {
    // Read JWT token stored after login
    const token = localStorage.getItem("token");

    // If token exists, attach it to Authorization header
    if (token) {
      // Standard JWT header format used by backend
      // Authorization: Bearer <token>
      config.headers.Authorization = `Bearer ${token}`;
    }

    // IMPORTANT:
    // Always return config so request can continue
    return config;
  },

  // If request setup fails, reject the promise
  (error) => Promise.reject(error)
);

/**
 * ============================
 * RESPONSE INTERCEPTOR
 * ============================
 * This runs AFTER backend responds
 *
 * Purpose:
 * 1. Catch authentication errors globally
 * 2. Auto-logout user if JWT expires
 * 3. Prevent app crash due to invalid session
 *
 * Backend standard error response:
 * {
 *   message: "TOKEN_INVALID_OR_EXPIRED"
 * }
 */
api.interceptors.response.use(
  // If response is successful, return it directly
  (response) => response,

  // Handle errors from backend
  (error) => {
    // Optional chaining (?.) prevents runtime errors
    // Check:
    // - Status code is 401 (Unauthorized)
    // - Error message indicates expired or invalid JWT
    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "TOKEN_INVALID_OR_EXPIRED"
    ) {
      // Log warning for debugging purposes
      console.warn("JWT expired or invalid. Auto-logout triggered.");

      // Clear authentication-related data from browser
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      // Redirect user to login page
      // This ensures user re-authenticates
      window.location.href = "/login";
    }

    // Reject error so calling component can still handle it if needed
    return Promise.reject(error);
  }
);

// Export Axios instance so it can be used across the app
// Example usage:
// api.get("/courses")
// api.post("/auth/login", data)
export default api;
