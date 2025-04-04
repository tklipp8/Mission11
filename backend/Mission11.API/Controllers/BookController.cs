using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mission11.API.Data;
using System.Linq;

namespace Mission11.API.Controllers
{
    // Defines a controller for handling book-related API requests
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly BookDbContext _bookContext;
        public BookController(BookDbContext temp) => _bookContext = temp;

        // Endpoint to get paginated and sorted list of books
        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, string? sortOrder = null, [FromQuery] List<string> bookCategories = null)
        {
            var query = _bookContext.Books.AsQueryable();

            if (bookCategories != null && bookCategories.Any())
            {
                query = query.Where(b => bookCategories.Contains(b.Category));
            }

            if (!string.IsNullOrEmpty(sortOrder))
            {
                query = sortOrder.ToLower() switch
                {
                    "asc" => query.OrderBy(b => b.Title),
                    "desc" => query.OrderByDescending(b => b.Title),
                    _ => query.OrderBy(b => b.Title)
                };
            }

            var bookList = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var totalNumBooks = query.Count();

            var listAll = new
            {
                Books = bookList,
                TotalNumBooks = totalNumBooks
            };

            return Ok(listAll);
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
            _bookContext.Books.Add(book);
            _bookContext.SaveChanges();
            return Ok(book);
        }

        // Update an existing book
        [HttpPut("Update/{id}")]
        public IActionResult UpdateBook(int id, [FromBody] Book book)
        {
            var existingBook = _bookContext.Books.Find(id);

            if (existingBook == null)
            {
                return NotFound(new { message = "Book not found" });
            }

            existingBook.Title = book.Title;
            existingBook.Author = book.Author;
            existingBook.Publisher = book.Publisher;
            existingBook.ISBN = book.ISBN;
            existingBook.Classification = book.Classification;
            existingBook.Category = book.Category;
            existingBook.PageCount = book.PageCount;
            existingBook.Price = book.Price;

            _bookContext.Books.Update(existingBook);
            _bookContext.SaveChanges();

            return Ok(existingBook);
        }

        // Delete a book
        [HttpDelete("Delete/{id}")]
        public IActionResult DeleteBook(int id)
        {
            var book = _bookContext.Books.Find(id);

            if (book == null)
            {
                return NotFound(new { message = "Book not found" });
            }

            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();

            return NoContent();
        }
    }
}

