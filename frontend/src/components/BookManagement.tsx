import { useState } from 'react';
import { Book } from '../types/Book';
import { addBook, updateBook } from '../api/BooksAPI';
// , deleteBook
interface BookManagementProps {
    onBookAdded: () => void;
    onBookUpdated: () => void;
    onBookDeleted: () => void;
}
// , onBookDeleted 
function BookManagement({ onBookAdded, onBookUpdated}: BookManagementProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [formData, setFormData] = useState<Partial<Book>>({
        title: '',
        author: '',
        publisher: '',
        iSBN: '',
        classification: '',
        category: '',
        pageCount: 0,
        price: 0
    });

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
                onBookUpdated();
            } else {
                await addBook(formData as Book);
                onBookAdded();
            }
            resetForm();
        } catch (error) {
            console.error('Error saving book:', error);
        }
    };

    // const handleDelete = async (bookId: number) => {
    //     if (window.confirm('Are you sure you want to delete this book?')) {
    //         try {
    //             await deleteBook(bookId);
    //             onBookDeleted();
    //         } catch (error) {
    //             console.error('Error deleting book:', error);
    //         }
    //     }
    // };

    const resetForm = () => {
        setFormData({
            title: '',
            author: '',
            publisher: '',
            iSBN: '',
            classification: '',
            category: '',
            pageCount: 0,
            price: 0
        });
        setEditingBook(null);
        setIsAdding(false);
    };

    return (
        <div className="book-management">
            <h3>Book Management</h3>
            
            {!isAdding && !editingBook && (
                <button className="btn btn-primary mb-3" onClick={() => setIsAdding(true)}>
                    Add New Book
                </button>
            )}

            {(isAdding || editingBook) && (
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="mb-3">
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
                    <div className="mb-3">
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
                    <div className="mb-3">
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
                    <div className="mb-3">
                        <label className="form-label">ISBN</label>
                        <input
                            type="text"
                            className="form-control"
                            name="iSBN"
                            value={formData.iSBN}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
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
                    <div className="mb-3">
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
                    <div className="mb-3">
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
                    <div className="mb-3">
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
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-success">
                            {editingBook ? 'Update Book' : 'Add Book'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={resetForm}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default BookManagement; 