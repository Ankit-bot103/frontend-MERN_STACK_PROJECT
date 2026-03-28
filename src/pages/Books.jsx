```javascript
// Import React hooks used for state management and lifecycle events
import { useEffect, useState } from "react";

// Import React Router hook used to read navigation state (messages passed from previous page)
import { useLocation } from "react-router-dom";

// Import Axios API instance configured with baseURL and JWT interceptor
// This ensures Authorization token is automatically attached to requests
import api from "../api/axios";

// Import CSS styles specific to Books page
import "../styles/books.css";


/*
  ======================================================
  BOOKS PAGE COMPONENT
  ======================================================
  Responsibilities:
  - Fetch books from backend
  - Display books list
  - Add new books
  - Edit existing books
  - Delete books
  - Support pagination
  - Support search
  - Show login success message
*/
const Books = () => {

  // React Router location object
  // Used to read messages passed during navigation
  const location = useLocation();

  // Message passed from login page
  const successMessage = location.state?.message;


  /*
  ======================================================
  STATE: BOOK DATA
  ======================================================
  books   → list of books returned from backend
  loading → indicates whether data is currently loading
  */
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);


  /*
  ======================================================
  STATE: PAGINATION
  ======================================================
  page        → current page number
  totalPages → total pages returned by backend
  limit       → number of books per page
  */
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fixed number of books shown per page
  const limit = 5;


  /*
  ======================================================
  STATE: SEARCH
  ======================================================
  search → text entered by user for filtering books
  */
  const [search, setSearch] = useState("");


  /*
  ======================================================
  STATE: EDIT MODE
  ======================================================
  editingId → ID of book currently being edited
  editData  → temporary data used while editing
  */
  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({
    title: "",
    author: "",
    year: ""
  });


  /*
  ======================================================
  STATE: CREATE FORM
  ======================================================
  formData → values entered in Add Book form
  */
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    year: ""
  });


  /*
  ======================================================
  FUNCTION: FETCH BOOKS
  ======================================================
  - Fetch books from backend
  - Includes pagination & search parameters
  - Updates UI state
  */
  const fetchBooks = async (pageNumber = 1) => {

    try {

      // Enable loading state while API request runs
      setLoading(true);

      // Send GET request with pagination and search query
      const res = await api.get(
        `/books?page=${pageNumber}&limit=${limit}&search=${search}`
      );

      // Update books list with response data
      setBooks(res.data.data);

      // Update current page number
      setPage(res.data.page);

      // Update total pages available
      setTotalPages(res.data.totalPages);

    } catch (err) {

      // Show error alert if books cannot be fetched
      alert("Failed to load books");

    } finally {

      // Disable loading state after request completes
      setLoading(false);

    }

  };


  /*
  ======================================================
  useEffect
  ======================================================
  Automatically fetch books when:
  - page changes
  - search text changes
  */
  useEffect(() => {

    fetchBooks(page);

  }, [page, search]);


  /*
  ======================================================
  FUNCTION: CREATE BOOK
  ======================================================
  - Sends new book data to backend
  - Clears form
  - Reloads books list
  */
  const handleCreate = async (e) => {

    // Prevent page refresh
    e.preventDefault();

    // Send POST request to create book
    await api.post("/books", {
      ...formData,

      // Convert year string to number
      year: Number(formData.year)
    });

    // Reset form fields
    setFormData({
      title: "",
      author: "",
      year: ""
    });

    // Return to first page after adding book
    setPage(1);

    // Reload books list
    fetchBooks(1);

  };


  /*
  ======================================================
  FUNCTION: DELETE BOOK
  ======================================================
  - Confirm deletion
  - Send DELETE request
  - Reload books list
  */
  const handleDelete = async (id) => {

    // Confirm deletion before proceeding
    if (!window.confirm("Delete this book?")) return;

    // Send DELETE request
    await api.delete(`/books/${id}`);

    // Reload books list
    fetchBooks(page);

  };


  /*
  ======================================================
  EDIT MODE FUNCTIONS
  ======================================================
  */

  // Enable editing mode for selected book
  const startEdit = (book) => {

    // Store ID of book being edited
    setEditingId(book._id);

    // Populate edit form with existing book data
    setEditData({
      title: book.title,
      author: book.author,
      year: book.year
    });

  };


  // Cancel editing mode
  const cancelEdit = () => {

    // Reset editing state
    setEditingId(null);

    setEditData({
      title: "",
      author: "",
      year: ""
    });

  };


  // Save edited book data
  const saveEdit = async (id) => {

    // Send PUT request to update book
    await api.put(`/books/${id}`, {
      ...editData,
      year: Number(editData.year)
    });

    // Exit edit mode
    cancelEdit();

    // Reload books list
    fetchBooks(page);

  };


  /*
  ======================================================
  LOADING UI
  ======================================================
  Show loading text while books are being fetched
  */
  if (loading) {

    return <p>Loading...</p>;

  }


  /*
  ======================================================
  JSX UI RENDER
  ======================================================
  */
  return (

    <div className="books-container">

      {/* Page title */}
      <h2>Books</h2>


      {/* Show login success message */}
      {successMessage && (
        <p className="auth-success">
          {successMessage}
        </p>
      )}


      {/* ================= SEARCH BAR ================= */}
      <div className="search-container">

        {/* Search input field */}
        <input
          className="search-input"
          placeholder="Search by title or author..."
          value={search}

          // Update search state when user types
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* Clear search button */}
        {search && (
          <button
            className="search-clear"
            type="button"
            onClick={() => {
              setSearch("");
              setPage(1);
            }}
          >
            ×
          </button>
        )}

      </div>


      {/* ================= ADD BOOK FORM ================= */}
      <form className="add-book-form" onSubmit={handleCreate}>

        {/* Title input */}
        <input
          placeholder="Title"
          value={formData.title}
          onChange={(e) =>
            setFormData({
              ...formData,
              title: e.target.value
            })
          }
          required
        />


        {/* Author input */}
        <input
          placeholder="Author"
          value={formData.author}
          onChange={(e) =>
            setFormData({
              ...formData,
              author: e.target.value
            })
          }
          required
        />


        {/* Year input */}
        <input
          type="number"
          placeholder="Year"
          value={formData.year}
          onChange={(e) =>
            setFormData({
              ...formData,
              year: e.target.value
            })
          }
          required
        />

        {/* Submit button */}
        <button className="btn btn-primary">
          Add Book
        </button>

      </form>


      {/* ================= BOOK LIST ================= */}
      {books.length === 0 ? (

        <p>No books found</p>

      ) : (

        books.map((book) => (

          <div key={book._id} className="book-row">

            {/* If book is in edit mode */}
            {editingId === book._id ? (

              <>

                {/* Editable title field */}
                <input
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      title: e.target.value
                    })
                  }
                />


                {/* Editable author field */}
                <input
                  value={editData.author}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      author: e.target.value
                    })
                  }
                />


                {/* Editable year field */}
                <input
                  type="number"
                  value={editData.year}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      year: e.target.value
                    })
                  }
                />


                {/* Save edit button */}
                <button
                  className="btn btn-save"
                  onClick={() => saveEdit(book._id)}
                >
                  Save
                </button>


                {/* Cancel edit button */}
                <button
                  className="btn btn-cancel"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>

              </>

            ) : (

              <>

                {/* Display book title */}
                <div className="book-title">
                  {book.title}
                </div>


                {/* Display author and year */}
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

              </>

            )}

          </div>

        ))

      )}


      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (

        <div className="pagination">

          {/* Previous page button */}
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ◀ Prev
          </button>


          {/* Page number buttons */}
          {[...Array(totalPages)].map((_, i) => (

            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>

          ))}


          {/* Next page button */}
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


// Export Books component
export default Books;
```
