using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mission11.API.Data;

namespace Mission11.API.Controllers
{
    // Defines a controller for handling book-related API requests
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _bookContext;

        // Constructor to initialize database context
        public BookController(BookDbContext temp) => _bookContext = temp;

        // Endpoint to get paginated and sorted list of books
        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageSize, int pageNum, string sortOrder = "asc")
        {
            var query = _bookContext.Books.AsQueryable(); // Get all books as a queryable object

            // Apply sorting based on the sortOrder parameter
            if (sortOrder == "asc")
            {
                query = query.OrderBy(x => x.Title);
            }
            else
            {
                query = query.OrderByDescending(x => x.Title);
            }

            // Count total books
            var totalNumBooks = query.Count();
            var totalPages = (int)Math.Ceiling(totalNumBooks / (double)pageSize);

            // Apply pagination
            var books = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Create response object with books and pagination details
            var bookObject = new
            {
                Books = books,
                TotalNumBooks = totalNumBooks,
                TotalPages = totalPages
            };

            return Ok(bookObject); // Return the response as HTTP 200 OK
        }
    }
}

