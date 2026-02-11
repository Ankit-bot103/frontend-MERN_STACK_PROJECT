# 📚 Book Management System – Frontend (React + Vite)

This is the **frontend client application** for the **Book Management System**, built using **React**, **Vite**, and **Axios**.  
It consumes a secure **JWT-based backend API** and provides a clean, modern UI for managing books.

---

## 🚀 Tech Stack

- **React 18** – UI library
- **Vite** – Fast build tool & dev server
- **React Router DOM** – Client-side routing
- **Axios** – API communication
- **Context API** – Global authentication state
- **CSS (modular styles)** – Custom UI styling

---

## 📂 Project Structure

```
client/
│
├── src/
│   ├── api/
│   │   └── axios.js              # Axios instance + JWT interceptors
│   │
│   ├── components/
│   │   ├── Navbar.jsx            # Top navigation bar
│   │   └── ProtectedRoute.jsx    # Route guard for authenticated users
│   │
│   ├── context/
│   │   └── AuthContext.jsx       # Global auth state (login/logout/token)
│   │
│   ├── pages/
│   │   ├── Home.jsx              # Project overview / landing page
│   │   ├── Login.jsx             # User login screen
│   │   ├── Register.jsx          # User registration screen
│   │   └── Books.jsx             # Core CRUD + Search + Pagination UI
│   │
│   ├── styles/
│   │   ├── books.css             # Styling for Books page
│   │   ├── auth.css              # Styling for Login & Register
│   │   └── navbar.css            # Navbar styling
│   │
│   ├── App.jsx                   # Routes configuration
│   ├── main.jsx                  # React entry point
│   │
│   └── index.css (optional)      # Global styles if needed
│
├── .env                          # Frontend environment variables
├── package.json
├── vite.config.js
└── README.md
```

---

## 🧠 Architecture Overview

### 1️⃣ Pages (`src/pages/`)

#### 🔹 Home.jsx
- Acts as a **hero/landing page**
- Explains:
  - What the project is
  - Key features
  - Tech stack
- No scrolling-heavy UI

#### 🔹 Login.jsx
- Authenticates users
- Sends credentials to backend `/auth/login`
- Stores JWT token in `localStorage`
- Redirects to `/books` on success

#### 🔹 Register.jsx
- Registers new users via `/auth/register`
- Validates inputs
- Redirects to login after success

#### 🔹 Books.jsx (Core Feature)
Implements **full book management UI**:
- ➕ Create book
- ✏️ Edit book
- ❌ Delete book
- 🔍 Search (title / author)
- 📄 Pagination (backend-driven)
- 🔐 JWT-protected operations
- 🧼 Clear search with ❌ button

---

### 2️⃣ Components (`src/components/`)

#### 🔹 Navbar.jsx
- Visible on all pages
- Shows links conditionally:
  - Login / Register (guest)
  - Books / Logout (authenticated)
- Matches Books page UI theme

#### 🔹 ProtectedRoute.jsx
- Wraps protected routes
- Blocks unauthenticated access
- Redirects to `/login` if token missing

---

### 3️⃣ Auth Context (`src/context/AuthContext.jsx`)

Centralized authentication logic:
- Stores:
  - `isAuth`
  - `role`
  - JWT token
- Exposes:
  - `login(token, role)`
  - `logout()`
- Keeps UI state in sync with auth status

---

### 4️⃣ API Layer (`src/api/axios.js`)

Reusable Axios instance:
- Base URL from `.env`
- Automatically attaches JWT:
  ```
  Authorization: Bearer <token>
  ```
- Global 401 handler:
  - Clears storage
  - Redirects to `/login`

---

### 5️⃣ Styling (`src/styles/`)

- **books.css**
  - Grid-based book list
  - Buttons (add/edit/delete/save/cancel)
  - Pagination UI
  - Search bar with clear ❌

- **auth.css**
  - Centered login/register cards
  - Error messaging
  - Consistent UI with books page

- **navbar.css**
  - Sticky top navbar
  - Styled links & buttons
  - Theme-aligned colors

---

## 🔐 Authentication Flow

1. User logs in / registers
2. Backend returns JWT token
3. Token stored in `localStorage`
4. Axios interceptor attaches token to all requests
5. Protected routes validate token
6. Expired token → auto logout

---

## 🌐 Environment Variables

Create `.env` file in project root:

```
VITE_API_BASE_URL=http://localhost:8800/api
```

> ⚠️ Do NOT commit `.env` to GitHub

---

## ▶️ How to Run the Frontend

### Install dependencies
```bash
npm install
```

### Start development server
```bash
npm run dev
```

Expected output:
```
VITE vX.X.X ready in XXX ms
Local: http://localhost:5173
```

---

## ✅ Features Implemented

- Authentication (Login / Register)
- JWT-secured API calls
- Book CRUD operations
- Pagination (backend-driven)
- Search with live filtering
- Responsive, clean UI
- Protected routes
- Global auth state
- Auto logout on token expiry

---

## 📌 Future Enhancements (Optional)

- Sorting (title/year)
- Toast notifications
- Role-based delete restrictions
- Deployment (Netlify + Render)
- Dark mode
- Form validation messages

---

## 👨‍💻 Author

**Nischal Aremanda**  
Full-Stack Developer  
React | Node.js | MongoDB | JWT

