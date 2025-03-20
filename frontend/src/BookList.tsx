import { useEffect, useState } from "react";
import { Book } from "./types/Book";

function BookList() {
    // Set our constants so we can get all of the books, dynamic page size, page num, total pages, and so we can change the sort order.
    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    // Bring in the use effect, establish our url and other functions
    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch(
                `https://localhost:5000/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}`
            );
            const data = await response.json();
            setBooks(data.books);
            setTotalPages(data.totalPages);
        };

        fetchBooks();
    }, [pageSize, pageNum, sortOrder]);

    // Function to toggle sorting order
    const toggleSortOrder = () => {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    };

    return (
        <>
            <h1>Bookstore</h1>
            <br />

            {/* Sorting Button */}
            <button className="btn btn-primary mb-3" onClick={toggleSortOrder}>
                Sort by Title {sortOrder === "asc" ? "🔼" : "🔽"}
            </button>

            {books.map((b) => (
                <div key={b.iSBN} id="bookCard" className="card">
                    <h3 className="card-title">{b.title}</h3>
                    <div className="card-body">
                        <ul className="list-unstyled">
                            <li><strong>Author: </strong>{b.author}</li>
                            <li><strong>Publisher: </strong>{b.publisher}</li>
                            <li><strong>ISBN: </strong>{b.iSBN}</li>
                            <li><strong>Classification: </strong>{b.classification}</li>
                            <li><strong>Category: </strong>{b.category}</li>
                            <li><strong>Number of Pages: </strong>{b.pageCount}</li>
                            <li><strong>Price: </strong>${b.price}</li>
                        </ul>
                    </div>
                </div>
            ))}

            {/* Pagination Controls */}
            <div className="d-flex justify-content-center mt-3">
                <button 
                    className="btn btn-outline-secondary mx-1"
                    disabled={pageNum === 1} 
                    onClick={() => setPageNum((prev) => Math.max(prev - 1, 1))}
                >
                    Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <button 
                        key={i + 1} 
                        className={`btn mx-1 ${pageNum === i + 1 ? "btn-secondary" : "btn-outline-secondary"}`}
                        onClick={() => setPageNum(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}

                <button 
                    className="btn btn-outline-secondary mx-1"
                    disabled={pageNum === totalPages} 
                    onClick={() => setPageNum((prev) => Math.min(prev + 1, totalPages))}
                >
                    Next
                </button>
            </div>

            <br />
            <label>
                Results per page:
                <select
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPageNum(1); // Reset to first page
                    }}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </label>
        </>
    );
}

export default BookList;