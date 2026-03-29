// Import React hooks used for state management and lifecycle
import { useEffect, useState } from "react";

// Import router hook to access navigation state (used for success message)
import { useLocation } from "react-router-dom";

// Import preconfigured axios instance used for API requests
import api from "../api/axios";

// Import CSS styles for Books page
import "../styles/books.css";


// Main Books component
const Books = () => {

  // Get navigation state (used to read login success message)
  const location = useLocation();

  // Extract success message passed from login page
  const successMessage = location.state?.message;


  /*
  =====================================================
  SUCCESS MESSAGE STATE
  =====================================================
  Controls visibility of login success message
  */
  const [showMessage, setShowMessage] = useState(true);


  /*
  =====================================================
  PRODUCT TOUR STATE (LOCAL STORAGE)
  =====================================================
  This ensures the onboarding tour runs only once.
  */
  const [tourStep, setTourStep] = useState(() => {

    // Read stored value from browser
    const completed = localStorage.getItem("booksTourCompleted");

    // If tour already completed skip it
    if (completed === "true") {
      return 999;
    }

    // Otherwise start from first step
    return 0;

  });


  /*
  List of instructions displayed during the tour
  */
  const tourSteps = [
    "Add a new book using Title, Author and Year fields.",
    "Click Edit to modify an existing book.",
    "Click Delete to remove a book.",
    "Use the search bar to filter books.",
    "Use pagination to navigate between pages."
  ];


  /*
  =====================================================
  BOOK DATA STATE
  =====================================================
  */
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);


  /*
  =====================================================
  PAGINATION STATE
  =====================================================
  */
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;


  /*
  =====================================================
  SEARCH STATE
  =====================================================
  */
  const [search, setSearch] = useState("");


  /*
  =====================================================
  EDIT MODE STATE
  =====================================================
  */
  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({
    title: "",
    author: "",
    year: ""
  });


  /*
  =====================================================
  CREATE FORM STATE
  =====================================================
  */
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    year: ""
  });


  /*
  =====================================================
  AUTO HIDE SUCCESS MESSAGE
  =====================================================
  */
  useEffect(() => {

    if (successMessage) {

      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timer);

    }

  }, [successMessage]);


  /*
  =====================================================
  FETCH BOOKS FROM BACKEND
  =====================================================
  */
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


  /*
  Load books when page or search changes
  */
  useEffect(() => {

    fetchBooks(page);

  }, [page, search]);


  /*
  =====================================================
  CREATE BOOK
  =====================================================
  */
  const handleCreate = async (e) => {

    e.preventDefault();

    await api.post("/books", {
      ...formData,
      year: Number(formData.year)
    });

    setFormData({ title: "", author: "", year: "" });

    setPage(1);
    fetchBooks(1);

  };


  /*
  =====================================================
  DELETE BOOK
  =====================================================
  */
  const handleDelete = async (id) => {

    if (!window.confirm("Delete this book?")) return;

    await api.delete(`/books/${id}`);

    fetchBooks(page);

  };


  /*
  =====================================================
  START EDIT MODE
  =====================================================
  */
  const startEdit = (book) => {

    setEditingId(book._id);

    setEditData({
      title: book.title,
      author: book.author,
      year: book.year
    });

  };


  /*
  =====================================================
  CANCEL EDIT
  =====================================================
  */
  const cancelEdit = () => {

    setEditingId(null);

    setEditData({ title: "", author: "", year: "" });

  };


  /*
  =====================================================
  SAVE EDITED BOOK
  =====================================================
  */
  const saveEdit = async (id) => {

    await api.put(`/books/${id}`, {
      ...editData,
      year: Number(editData.year)
    });

    cancelEdit();
    fetchBooks(page);

  };


  /*
  =====================================================
  LOADING SCREEN
  =====================================================
  */
  if (loading) {

    return (
      <div className="books-loading">
        <div className="spinner-dark"></div>
        <p>Loading books...</p>
      </div>
    );

  }


  /*
  =====================================================
  MAIN UI
  =====================================================
  */
  return (

    <div className="books-container">

      <h2>Books</h2>


      {/* PRODUCT TOUR OVERLAY */}
      {tourStep < tourSteps.length && (

        <div className="books-tour">

          <div className="tour-card">

            <h3>📘 Books Tour</h3>

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

                    // Save completion flag
                    localStorage.setItem("booksTourCompleted", "true");

                    // End the tour
                    setTourStep(tourSteps.length);

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
        <p className="auth-success">
          {successMessage}
        </p>
      )}


      {/* SEARCH BAR */}
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


      {/* ADD BOOK FORM */}
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

          <div className="book-title">{book.title}</div>

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


// Export component for routing
export default Books;
