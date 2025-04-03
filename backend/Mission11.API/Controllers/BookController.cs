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
        public IActionResult GetBooks(int pageSize, int pageNum = 1, string sortOrder = "asc", [FromQuery] List<string> bookCategories = null)
        {
            var query = _bookContext.Books.AsQueryable(); // Get all books as a queryable object

            if (bookCategories != null && bookCategories.Any())
            {
                // Filter books based on the provided categories
                query = query.Where(x => bookCategories.Contains(x.Category));
            }

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

        [HttpGet("GetBookCategories")]
        public IActionResult GetBookCategories()
        {
            var bookCategories = _bookContext.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();
            return Ok(bookCategories);
        }

        // Add a new book
        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book book)
        {
            try
            {
                _bookContext.Books.Add(book);
                _bookContext.SaveChanges();
                return Ok(book);
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to add book: {ex.Message}");
            }
        }

        // Update an existing book
        [HttpPut("Update/{id}")]
        public IActionResult UpdateBook(int id, [FromBody] Book book)
        {
            try
            {
                var existingBook = _bookContext.Books.Find(id);
                if (existingBook == null)
                {
                    return NotFound($"Book with ID {id} not found");
                }

                // Update the existing book's properties
                existingBook.Title = book.Title;
                existingBook.Author = book.Author;
                existingBook.Publisher = book.Publisher;
                existingBook.ISBN = book.ISBN;
                existingBook.Classification = book.Classification;
                existingBook.Category = book.Category;
                existingBook.PageCount = book.PageCount;
                existingBook.Price = book.Price;

                _bookContext.SaveChanges();
                return Ok(existingBook);
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to update book: {ex.Message}");
            }
        }

        // Delete a book
        [HttpDelete("Delete/{id}")]
        public IActionResult DeleteBook(int id)
        {
            try
            {
                var book = _bookContext.Books.Find(id);
                if (book == null)
                {
                    return NotFound($"Book with ID {id} not found");
                }

                _bookContext.Books.Remove(book);
                _bookContext.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to delete book: {ex.Message}");
            }
        }
    }
}

