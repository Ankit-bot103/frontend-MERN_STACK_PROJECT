// React hooks used to manage state and lifecycle in functional components
import { useEffect, useState } from "react";

// Axios instance configured with baseURL and JWT interceptor
// This automatically attaches Authorization token to every request
import api from "../api/axios";

// CSS specific to Books page UI
import "../styles/books.css";

/*
  ======================================================
  BOOKS PAGE (Frontend – React)
  ======================================================
  Purpose:
  - Display list of books from backend
  - Allow user to create, edit, delete books
  - Support pagination & search
  - Communicate with JWT-protected APIs

  Backend APIs used:
  - GET    /books
  - POST   /books
  - PUT    /books/:id
  - DELETE /books/:id
*/
const Books = () => {

  /* --------------------------------------------------
     STATE: BOOK DATA
     --------------------------------------------------
     books   → array of book objects fetched from backend
     loading → used to show loading text while API runs
  */
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  /* --------------------------------------------------
     STATE: PAGINATION
     --------------------------------------------------
     page        → current page number
     totalPages → total pages returned by backend
     limit       → how many books per page
  */
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  /* --------------------------------------------------
     STATE: SEARCH
     --------------------------------------------------
     search → text entered by user for filtering books
  */
  const [search, setSearch] = useState("");

  /* --------------------------------------------------
     STATE: EDIT MODE
     --------------------------------------------------
     editingId → stores ID of book currently being edited
     editData  → holds editable values of selected book
  */
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    author: "",
    year: ""
  });

  /* --------------------------------------------------
     STATE: CREATE FORM
     --------------------------------------------------
     formData → values entered in Add Book form
  */
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    year: ""
  });

  /* ==================================================
     FUNCTION: FETCH BOOKS
     ==================================================
     - Calls backend API with pagination & search params
     - Updates books list and pagination state
  */
  const fetchBooks = async (pageNumber = 1) => {
    try {
      // Show loading text
      setLoading(true);

      // API call with query parameters
      const res = await api.get(
        `/books?page=${pageNumber}&limit=${limit}&search=${search}`
      );

      // Update UI with response data
      setBooks(res.data.data);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);

    } catch (err) {
      alert("Failed to load books");
    } finally {
      // Hide loading text
      setLoading(false);
    }
  };

  /* --------------------------------------------------
     useEffect
     --------------------------------------------------
     Automatically runs fetchBooks when:
     - page changes
     - search text changes
  */
  useEffect(() => {
    fetchBooks(page);
  }, [page, search]);

  /* ==================================================
     FUNCTION: CREATE BOOK
     ==================================================
     - Sends new book to backend
     - Resets form
     - Reloads first page (newest book visible)
  */
  const handleCreate = async (e) => {
    e.preventDefault(); // Prevent page refresh

    await api.post("/books", {
      ...formData,
      year: Number(formData.year) // Convert string → number
    });

    // Clear form inputs
    setFormData({ title: "", author: "", year: "" });

    // Go back to first page after adding book
    setPage(1);
    fetchBooks(1);
  };

  /* ==================================================
     FUNCTION: DELETE BOOK
     ==================================================
     - Confirms action
     - Calls DELETE API
     - Reloads current page
  */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;

    await api.delete(`/books/${id}`);
    fetchBooks(page);
  };

  /* ==================================================
     EDIT MODE FUNCTIONS
     ==================================================
  */

  // Enable edit mode for selected book
  const startEdit = (book) => {
    setEditingId(book._id);
    setEditData({
      title: book.title,
      author: book.author,
      year: book.year
    });
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ title: "", author: "", year: "" });
  };

  // Save edited book data
  const saveEdit = async (id) => {
    await api.put(`/books/${id}`, {
      ...editData,
      year: Number(editData.year)
    });

    cancelEdit();
    fetchBooks(page);
  };

  /* --------------------------------------------------
     LOADING UI
     --------------------------------------------------
  */
  if (loading) return <p>Loading...</p>;

  /* ==================================================
     JSX UI
     ==================================================
  */
  return (
    <div className="books-container">
      <h2>Books</h2>

      {/* ================= SEARCH BAR ================= */}
      <div className="search-container">
        <input
          className="search-input"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value); // Update search text
            setPage(1);               // Reset to page 1
          }}
        />

        {/* Clear search (❌) */}
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

        <button className="btn btn-primary">Add Book</button>
      </form>

      {/* ================= BOOK LIST ================= */}
      {books.length === 0 ? (
        <p>No books found</p>
      ) : (
        books.map((book) => (
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
                  type="number"
                  value={editData.year}
                  onChange={(e) =>
                    setEditData({ ...editData, year: e.target.value })
                  }
                />

                <button className="btn btn-save" onClick={() => saveEdit(book._id)}>
                  Save
                </button>
                <button className="btn btn-cancel" onClick={cancelEdit}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div className="book-title">{book.title}</div>
                <div className="book-meta">
                  {book.author} ({book.year})
                </div>

                <button className="btn btn-edit" onClick={() => startEdit(book)}>
                  Edit
                </button>

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
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
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
