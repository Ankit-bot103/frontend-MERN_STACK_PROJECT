# 📚 Book Management System -- MERN Stack (Frontend)

A modern **MERN stack learning project** used in a **6-Day MERN
Bootcamp** to teach students how to build a **real-world full-stack
application**.

This frontend is built with **React + Vite** and communicates with a
**secure JWT-based Node.js backend API**.

Students learn how to build a **production-style SaaS dashboard
application** with authentication, CRUD operations, search, pagination,
responsive UI, and onboarding tour.

------------------------------------------------------------------------

# 🚀 Tech Stack

## Frontend

-   React 18
-   Vite
-   React Router DOM
-   Axios
-   Context API
-   Custom CSS

## Backend (separate repo)

-   Node.js
-   Express.js
-   MongoDB
-   JWT Authentication

------------------------------------------------------------------------

# 🎯 Features

## 🔐 Authentication

-   Register user
-   Login user
-   JWT authentication
-   Protected routes
-   Auto logout on token expiration

## 📚 Book Management

-   Create book
-   Edit book
-   Delete book
-   View books list

## 🔎 Search

-   Search by **title**
-   Search by **author**
-   Live filtering

## 📄 Pagination

-   Backend-driven pagination
-   Page navigation
-   Dynamic page buttons

## 🎯 UX Improvements

-   Loading spinner
-   Login progress bar
-   Success messages
-   Error handling
-   Disabled buttons during loading

## 🧭 Interactive Product Tour

First-time users see a guided tour explaining:

1.  Add Book\
2.  Edit Book\
3.  Delete Book\
4.  Search Books\
5.  Pagination

Tour runs **only once using localStorage**.

## 📱 Responsive UI

Works on:

-   Mobile phones
-   Tablets
-   Laptops
-   Desktop monitors
-   Large screens / projectors

## 🧑‍💻 Dashboard Layout

SaaS-style UI with:

-   Sidebar navigation
-   Top navbar
-   Main content panel

------------------------------------------------------------------------
## 📂 Project Structure

```
client/
│
├── src/
│   ├── api/
│   │   └── axios.js
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Books.jsx
│   │
│   ├── styles/
│   │   ├── books.css
│   │   ├── auth.css
│   │   ├── navbar.css
│   │   └── dashboard.css
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── package.json
├── vite.config.js
└── README.md
```

------------------------------------------------------------------------

# 🧠 Architecture Overview

## Pages

### Home.jsx

Landing page explaining: - Project overview - Features - Technology
stack

### Login.jsx

Handles: - User login - JWT authentication - Redirect to dashboard -
Loading progress indicator

### Register.jsx

Handles: - User registration - Validation - Redirect to login page

### Books.jsx

Core application page implementing: - CRUD operations - Search -
Pagination - Onboarding tour - Responsive layout

------------------------------------------------------------------------

# 🔐 Authentication Flow

User logs in\
↓\
Backend returns JWT\
↓\
Token stored in localStorage\
↓\
Axios interceptor attaches token\
↓\
Protected routes allow access\
↓\
Expired token → auto logout

------------------------------------------------------------------------

# 🌐 Environment Variables

Create `.env` in the project root.

VITE_API_BASE_URL=http://localhost:8800/api

⚠️ Never commit `.env` to GitHub.

------------------------------------------------------------------------

# ▶️ Run the Project

Install dependencies

npm install

Start development server

npm run dev

Expected output:

VITE ready\
Local: http://localhost:5173




------------------------------------------------------------------------

# 💡 Live Deployment Links
Client/React/Ui App:- https://mern-stack-client-app.vercel.app
Server/Express/Backend App:- https://mern-stack-server-app-nischalaremanda.onrender.com


------------------------------------------------------------------------

# 👨‍💻 Author

**Nischal Aremanda**\
Full Stack Developer\
React \| Node.js \| MongoDB \| AI \| Cloud

------------------------------------------------------------------------

# ⭐ Project Goal

Helps in learning  **real-world MERN development** by building a
**complete full-stack application** instead of simple tutorials.
