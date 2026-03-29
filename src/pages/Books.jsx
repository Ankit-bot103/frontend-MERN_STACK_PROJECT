// Import React hooks used for managing state and lifecycle
import { useEffect, useState } from "react";

// Import router hook to access navigation state
// This allows us to read success messages passed during navigation
import { useLocation } from "react-router-dom";

// Import Axios instance configured with baseURL and JWT interceptor
import api from "../api/axios";

// Import styles specific to the Books page
import "../styles/books.css";


// Books component definition
const Books = () => {

  /*
  =====================================================
  READ SUCCESS MESSAGE FROM NAVIGATION STATE
  =====================================================
  When user logs in successfully we pass a message
  from Login page → Books page using React Router state
  */
  const location = useLocation();

  const successMessage = location.state?.message;


  /*
  =====================================================
  SUCCESS MESSAGE VISIBILITY STATE
  =====================================================
  This allows the success message to disappear automatically
  after a few seconds.
  */
  const [showMessage, setShowMessage] = useState(true);


  /*
  =====================================================
  PRODUCT TOUR STATE
  =====================================================
  The onboarding tour runs only once using localStorage
  */
  const [tourStep, setTourStep] = useState(() => {

    const completed = localStorage.getItem("booksTourCompleted");

    if (completed === "true") {
      return 999;
    }

    return 0;

  });


  /*
  Instructions displayed during onboarding tour
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
  books → stores books returned from backend
  loading → controls loading spinner/skeleton
  */
  const [books, setBooks] = useState([]);

  const [loading, setLoading] = useState(true);


  /*
  =====================================================
  PAGINATION STATE
  =====================================================
  page → current page
  totalPages → pages returned from backend
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
  Load books whenever page or search changes
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

    setFormData({
      title: "",
      author: "",
      year: ""
    });

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
  MAIN PAGE UI
  =====================================================
  */
  return (

    <div className="books-container">

      <h2>Books</h2>


      {/* SUCCESS MESSAGE */}
      {successMessage && showMessage && (
        <p className="auth-success">{successMessage}</p>
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

          {/* Book title */}
          <div className="book-title">
            {book.title}
          </div>

          {/* Book author + year */}
          <div className="book-meta">
            {book.author} ({book.year})
          </div>

          {/* Edit button */}
          <button
            className="btn btn-edit"
            onClick={() => startEdit(book)}
          >
            Edit
          </button>

          {/* Delete button */}
          <button
            className="btn btn-delete"
            onClick={() => handleDelete(book._id)}
          >
            Delete
          </button>

        </div>

      ))}


      {/* PAGINATION */}
      {totalPages > 1 && (

        <div className="pagination">

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


// Export component so routing can use it
export default Books;
