/*
=====================================================
BOOKS PAGE
=====================================================

Features:

✔ Fetch books
✔ Create book
✔ Edit book
✔ Delete book
✔ Search
✔ Pagination
✔ Loading spinner
✔ Login success message
✔ Product tour
✔ Tour runs once using localStorage
*/

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axios";
import "../styles/books.css";

const Books = () => {

  /* ==========================================
  READ SUCCESS MESSAGE FROM LOGIN PAGE
  ========================================== */
  const location = useLocation();
  const successMessage = location.state?.message;

  const [showMessage, setShowMessage] = useState(true);


  /* ==========================================
  PRODUCT TOUR STATE
  ========================================== */

  const [tourStep, setTourStep] = useState(() => {

    const completed = localStorage.getItem("booksTourCompleted");

    if (completed === "true") {
      return 999;
    }

    return 0;
  });

  const tourSteps = [
    "Add a new book using Title, Author and Year fields.",
    "Click Edit to modify an existing book.",
    "Click Delete to remove a book.",
    "Use the search bar to filter books.",
    "Use pagination to navigate between pages."
  ];


  /* ==========================================
  BOOK DATA
  ========================================== */

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);


  /* ==========================================
  PAGINATION
  ========================================== */

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;


  /* ==========================================
  SEARCH
  ========================================== */

  const [search, setSearch] = useState("");


  /* ==========================================
  EDIT MODE STATE
  ========================================== */

  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({
    title: "",
    author: "",
    year: ""
  });


  /* ==========================================
  CREATE FORM STATE
  ========================================== */

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    year: ""
  });


  /* ==========================================
  AUTO HIDE LOGIN SUCCESS MESSAGE
  ========================================== */

  useEffect(() => {

    if (successMessage) {

      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timer);

    }

  }, [successMessage]);


  /* ==========================================
  FETCH BOOKS
  ========================================== */

  const fetchBooks = async (pageNumber = 1) => {

    try {

      setLoading(true);

      const res = await api.get(
        `/books?page=${pageNumber}&limit=${limit}&search=${search}`
      );

      setBooks(res.data.data);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);

    } catch (err) {

      alert("Failed to load books");

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {
    fetchBooks(page);
  }, [page, search]);


  /* ==========================================
  CREATE BOOK
  ========================================== */

  const handleCreate = async (e) => {

    e.preventDefault();

    await api.post("/books", {
      ...formData,
      year: Number(formData.year)
    });

    setFormData({
      title: "",
      author: "",
      year: ""
    });

    setPage(1);
    fetchBooks(1);

  };


  /* ==========================================
  DELETE BOOK
  ========================================== */

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this book?")) return;

    await api.delete(`/books/${id}`);

    fetchBooks(page);

  };


  /* ==========================================
  START EDIT
  ========================================== */

  const startEdit = (book) => {

    setEditingId(book._id);

    setEditData({
      title: book.title,
      author: book.author,
      year: book.year
    });

  };


  /* ==========================================
  CANCEL EDIT
  ========================================== */

  const cancelEdit = () => {
    setEditingId(null);
  };


  /* ==========================================
  SAVE EDIT
  ========================================== */

  const saveEdit = async (id) => {

    await api.put(`/books/${id}`, {
      ...editData,
      year: Number(editData.year)
    });

    cancelEdit();
    fetchBooks(page);

  };


  /* ==========================================
  LOADING SCREEN
  ========================================== */

  if (loading) {

    return (
      <div className="books-loading">
        <div className="spinner-dark"></div>
        <p>Loading books...</p>
      </div>
    );

  }


  /* ==========================================
  MAIN UI
  ========================================== */

  return (

    <div className="books-container">

      <h2>Books</h2>


      {/* PRODUCT TOUR */}
      {tourStep < tourSteps.length && (

        <div className="books-tour">

          <div className="tour-card">

            <h3>📘 Books Page Tour</h3>

            <p>{tourSteps[tourStep]}</p>

            <div className="tour-actions">

              {tourStep > 0 && (
                <button
                  className="btn btn-cancel"
                  onClick={() => setTourStep(tourStep - 1)}
                >
                  Back
                </button>
              )}

              {tourStep < tourSteps.length - 1 ? (

                <button
                  className="btn btn-primary"
                  onClick={() => setTourStep(tourStep + 1)}
                >
                  Next
                </button>

              ) : (

                <button
                  className="btn btn-save"
                  onClick={() => {

                    localStorage.setItem("booksTourCompleted", "true");
                    setTourStep(999);

                  }}
                >
                  Finish
                </button>

              )}

            </div>

          </div>

        </div>

      )}


      {/* SUCCESS MESSAGE */}
      {successMessage && showMessage && (
        <p className="auth-success">{successMessage}</p>
      )}


      {/* SEARCH */}
      <div className="search-container">

        <input
          className={`search-input ${tourStep === 3 ? "tour-highlight" : ""}`}
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

      </div>


      {/* CREATE BOOK */}
      <form
        className={`add-book-form ${tourStep === 0 ? "tour-highlight" : ""}`}
        onSubmit={handleCreate}
      >

        <input
          placeholder="Title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          required
        />

        <input
          placeholder="Author"
          value={formData.author}
          onChange={(e) =>
            setFormData({ ...formData, author: e.target.value })
          }
          required
        />

        <input
          type="number"
          placeholder="Year"
          value={formData.year}
          onChange={(e) =>
            setFormData({ ...formData, year: e.target.value })
          }
          required
        />

        <button className="btn btn-primary">
          Add Book
        </button>

      </form>


      {/* BOOK LIST */}
      {books.map((book) => (

        <div key={book._id} className="book-row">

          {editingId === book._id ? (

            <>
              <input
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
              />

              <input
                value={editData.author}
                onChange={(e) =>
                  setEditData({ ...editData, author: e.target.value })
                }
              />

              <input
                value={editData.year}
                onChange={(e) =>
                  setEditData({ ...editData, year: e.target.value })
                }
              />

              <button
                className="btn btn-save"
                onClick={() => saveEdit(book._id)}
              >
                Save
              </button>

              <button
                className="btn btn-cancel"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            </>

          ) : (

            <>
              <div className="book-title">
                {book.title}
              </div>

              <div className="book-meta">
                {book.author} ({book.year})
              </div>

              <button
                className={`btn btn-edit ${tourStep === 1 ? "tour-highlight" : ""}`}
                onClick={() => startEdit(book)}
              >
                Edit
              </button>

              <button
                className={`btn btn-delete ${tourStep === 2 ? "tour-highlight" : ""}`}
                onClick={() => handleDelete(book._id)}
              >
                Delete
              </button>
            </>

          )}

        </div>

      ))}


      {/* PAGINATION */}
      {totalPages > 1 && (

        <div className={`pagination ${tourStep === 4 ? "tour-highlight" : ""}`}>

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ◀ Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (

            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>

          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next ▶
          </button>

        </div>

      )}

    </div>

  );

};

export default Books;
