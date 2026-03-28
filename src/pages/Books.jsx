import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axios";
import "../styles/books.css";

const Books = () => {

  const location = useLocation();
  const successMessage = location.state?.message;

  const [showMessage, setShowMessage] = useState(true);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({
    title: "",
    author: "",
    year: ""
  });

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    year: ""
  });


  useEffect(() => {

    if (successMessage) {

      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timer);

    }

  }, [successMessage]);


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


  const handleDelete = async (id) => {

    if (!window.confirm("Delete this book?")) return;

    await api.delete(`/books/${id}`);

    fetchBooks(page);

  };


  const startEdit = (book) => {

    setEditingId(book._id);

    setEditData({
      title: book.title,
      author: book.author,
      year: book.year
    });

  };


  const cancelEdit = () => {

    setEditingId(null);

    setEditData({
      title: "",
      author: "",
      year: ""
    });

  };


  const saveEdit = async (id) => {

    await api.put(`/books/${id}`, {
      ...editData,
      year: Number(editData.year)
    });

    cancelEdit();
    fetchBooks(page);

  };


  if (loading) {

    return <p>Loading...</p>;

  }


  return (

    <div className="books-container">

      <h2>Books</h2>

      {successMessage && showMessage && (
        <p className="auth-success">
          {successMessage}
        </p>
      )}


      <div className="search-container">

        <input
          className="search-input"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

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

        <button className="btn btn-primary">
          Add Book
        </button>

      </form>


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
                <div className="book-title">{book.title}</div>

                <div className="book-meta">
                  {book.author} ({book.year})
                </div>

                <button
                  className="btn btn-edit"
                  onClick={() => startEdit(book)}
                >
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

export default Books;
