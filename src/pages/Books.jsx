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


  // State used to control visibility of success message
  const [showMessage, setShowMessage] = useState(true);


  /*
  =====================================================
  PRODUCT TOUR STATE
  =====================================================
  tourStep → controls which step of the onboarding tour is active
  */
  const [tourStep, setTourStep] = useState(0);


  // List of steps shown in the guided product tour
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
  books → stores list of books returned from backend
  loading → controls loading spinner
  */
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);


  /*
  =====================================================
  PAGINATION STATE
  =====================================================
  page → current page number
  totalPages → total pages returned by backend
  limit → books per page
  */
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;


  /*
  =====================================================
  SEARCH STATE
  =====================================================
  search → text entered by user for filtering books
  */
  const [search, setSearch] = useState("");


  /*
  =====================================================
  EDIT MODE STATE
  =====================================================
  editingId → ID of book currently being edited
  editData → editable book values
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
  formData → values entered in Add Book form
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
  After login success message appears,
  hide it automatically after 3 seconds
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
  FETCH BOOKS FUNCTION
  =====================================================
  Calls backend API with pagination and search parameters
  */
  const fetchBooks = async (pageNumber = 1) => {

    try {

      // Enable loading spinner
      setLoading(true);

      // Send GET request with query parameters
      const res = await api.get(
        `/books?page=${pageNumber}&limit=${limit}&search=${search}`
      );

      // Update UI with returned data
      setBooks(res.data.data);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);

    } catch (err) {

      alert("Failed to load books");

    } finally {

      // Disable loading spinner
      setLoading(false);

    }

  };


  /*
  =====================================================
  LOAD BOOKS WHEN PAGE OR SEARCH CHANGES
  =====================================================
  */
  useEffect(() => {

    fetchBooks(page);

  }, [page, search]);


  /*
  =====================================================
  CREATE BOOK
  =====================================================
  Sends POST request to backend
  */
  const handleCreate = async (e) => {

    e.preventDefault();

    await api.post("/books", {
      ...formData,
      year: Number(formData.year)
    });

    // Clear form inputs
    setFormData({ title: "", author: "", year: "" });

    // Refresh list
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

    setEditData({
      title: "",
      author: "",
      year: ""
    });

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
                  onClick={() => setTourStep(tourSteps.length)}
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


// Export component so it can be used in routing
export default Books;
