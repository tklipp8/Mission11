import { useEffect, useState } from "react";
import { Book } from "../types/Book";
import { useNavigate } from "react-router-dom";

function BookList({selectedCategories}: {selectedCategories: string[]}) {
    // Set our constants so we can get all of the books, dynamic page size, page num, total pages, and so we can change the sort order.
    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(5); // Default page size is 5
    const [pageNum, setPageNum] = useState<number>(1); // Current page number
    const [totalPages, setTotalPages] = useState<number>(0); // Total number of pages available
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Sorting order for books
    const navigate = useNavigate();

    // Bring in the use effect, establish our url and other functions
    useEffect(() => {
        fetchBooks();
    }, [pageSize, pageNum, sortOrder, selectedCategories]); // Dependencies for useEffect

    const fetchBooks = async () => {
        // Construct query parameters for selected categories
        const categoryParams = selectedCategories
            .map((cat) => `bookCategories=${encodeURIComponent(cat)}`)
            .join('&');

        // Fetch books from the backend API with pagination and sorting
        const response = await fetch(
            `https://lloyd-backend-e2aneebua8acarcc.eastus-01.azurewebsites.net/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}${selectedCategories.length ? `&${categoryParams}` : ''}`         
        );
        const data = await response.json();
        setBooks(data.books); // Update the books state with fetched data
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize)); // Calculate total pages based on total books and page size
    };

    // Function to toggle sorting order
    const toggleSortOrder = () => {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc")); // Toggle between ascending and descending
    };

    return (
        <>
            {/* Book Management Button */}
            <button 
                className="btn btn-primary mb-3" 
                onClick={() => navigate('/manage-books')}
            >
                Manage Books
            </button>

            {/* Sorting Button */}
            <br/>
            <button className="btn btn-secondary mb-3" onClick={toggleSortOrder}>
                Sort by Title {sortOrder === "asc" ? "🔼" : "🔽"} {/* Display sort direction */}
            </button>
            <br/><br/>

            {/* Render each book as a card */}
            {books.map((b) => (
                <div key={b.iSBN} id="bookCard" className="card">
                    <h3 className="card-title">{b.title}</h3>
                    <div className="card-body">
                        <ul className="list-unstyled">
                            <li className="card-text"><strong>Author: </strong>{b.author}</li>
                            <li className="card-text"><strong>Publisher: </strong>{b.publisher}</li>
                            <li className="card-text"><strong>ISBN: </strong>{b.iSBN}</li>
                            <li className="card-text"><strong>Classification: </strong>{b.classification}</li>
                            <li className="card-text"><strong>Category: </strong>{b.category}</li>
                            <li className="card-text"><strong>Number of Pages: </strong>{b.pageCount}</li>
                            <li className="card-text"><strong>Price: </strong>${b.price}</li>
                        </ul>

                        {/* Button to navigate to the purchase page */}
                        <button className="btn btn-success" onClick={() => navigate(`/purchase/${b.title}/${b.bookID}/${b.price}`)} >Buy</button>
                    </div>
                </div>
            ))}

            {/* Pagination Controls */}
            {/* ---------------------------- */}
            {/* NEW COOL BOOSTRAP PAGE NAVIGATION!!! */}
            {/* ---------------------------- */}
            <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center mt-3">
                    {/* Previous button */}
                    <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => setPageNum((prev) => Math.max(prev - 1, 1))} // Decrease page number
                        disabled={pageNum === 1} // Disable if on the first page
                    >
                        Previous
                    </button>
                    </li>

                    {/* Page number buttons */}
                    {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i + 1} className={`page-item ${pageNum === i + 1 ? 'active' : ''}`}>
                        <button
                        className="page-link"
                        onClick={() => setPageNum(i + 1)} // Set page number to the clicked page
                        >
                        {i + 1}
                        </button>
                    </li>
                    ))}

                    {/* Next button */}
                    <li className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => setPageNum((prev) => Math.min(prev + 1, totalPages))} // Increase page number
                        disabled={pageNum === totalPages} // Disable if on the last page
                    >
                        Next
                    </button>
                    </li>
                </ul>
            </nav>

            <br />
            {/* ---------------------------- */}
            {/* NEW COOL BOOSTRAP RESULTS PER PAGE THING!!! */}
            {/* ---------------------------- */}
            <div className="d-flex flex-column align-items-center mb-3">
                <label htmlFor="resultsPerPage" className="form-label">
                    Results per page:
                </label>
                <select
                    id="resultsPerPage"
                    className="form-select"
                    style={{ width: 'auto' }} // Adjust width for better alignment
                    value={pageSize} // Bind to pageSize state
                    onChange={(e) => {
                    setPageSize(Number(e.target.value)); // Update page size
                    setPageNum(1); // Reset to first page
                    }}
                >
                    {/* Options for results per page */}
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </div>
        </>
    );
}

export default BookList;