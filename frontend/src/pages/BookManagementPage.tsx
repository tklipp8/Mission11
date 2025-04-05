import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { addBook, updateBook, deleteBook } from '../api/BooksAPI';

function BookManagementPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState<Partial<Book>>({
        title: '',
        author: '',
        publisher: '',
        iSBN: '',
        classification: '',
        category: '',
        pageCount: 0,
        price: 0,
        bookID: 0
    });

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            const response = await fetch(
                'https://lloyd-backend-e2aneebua8acarcc.eastus-01.azurewebsites.net/Book/AllBooks?pageSize=100&pageNum=1&sortOrder=asc',
                {
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }
            const data = await response.json();
            setBooks(data.books);
        } catch (error) {
            console.error('Error loading books:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'pageCount' || name === 'price' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBook) {
                await updateBook(editingBook.bookID, formData as Book);
            } else {
                await addBook(formData as Book);
            }
            resetForm();
            loadBooks();
        } catch (error) {
            console.error('Error saving book:', error);
        }
    };

    const handleDelete = async (bookId: number) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await deleteBook(bookId);
                loadBooks();
            } catch (error) {
                console.error('Error deleting book:', error);
            }
        }
    };

    const handleEdit = (book: Book) => {
        setEditingBook(book);
        setFormData({
            title: book.title || '',
            author: book.author || '',
            publisher: book.publisher || '',
            iSBN: book.iSBN || '',
            classification: book.classification || '',
            category: book.category || '',
            pageCount: book.pageCount || 0,
            price: book.price || 0,
            bookID: book.bookID || 0
        });
        setShowAddForm(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            author: '',
            publisher: '',
            iSBN: '',
            classification: '',
            category: '',
            pageCount: 0,
            price: 0,
            bookID: 0
        });
        setEditingBook(null);
        setShowAddForm(false);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Book Management</h2>
                <button 
                    className="btn btn-primary" 
                    onClick={() => setShowAddForm(true)}
                >
                    Add New Book
                </button>
            </div>

            {showAddForm && (
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">
                            {editingBook ? 'Edit Book' : 'Add New Book'}
                        </h5>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Author</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Publisher</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="publisher"
                                        value={formData.publisher}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">ISBN</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="iSBN"
                                        value={formData.iSBN}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Classification</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="classification"
                                        value={formData.classification}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Category</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Page Count</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="pageCount"
                                        value={formData.pageCount}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Price</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-success">
                                    {editingBook ? 'Update Book' : 'Add Book'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Publisher</th>
                            <th>ISBN</th>
                            <th>Classification</th>
                            <th>Category</th>
                            <th>Page Count</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book.bookID}>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.publisher}</td>
                                <td>{book.iSBN}</td>
                                <td>{book.classification}</td>
                                <td>{book.category}</td>
                                <td>{book.pageCount}</td>
                                <td>${book.price.toFixed(2)}</td>
                                <td>
                                    <div className="btn-group">
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => handleEdit(book)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(book.bookID)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BookManagementPage; 