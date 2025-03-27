import BookList from '../components/BookList'; // Component to display the list of books
import CartSummary from '../components/CartSummary'; // Component to show the cart summary
import CategoryFilter from '../components/CategoryFilter' // Component to filter books by category
import WelcomeBand from '../components/WelcomeBand' // Component to display a welcome message or banner
import { useState } from 'react'; // React hook for managing state

function BookstorePage () {
    // State to track the selected categories for filtering books
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    return (
            <div className='container mt-4'> {/* Main container with margin-top */}
                <CartSummary /> {/* Displays the cart summary */}
                <WelcomeBand /> {/* Displays a welcome banner */}
                <div className='row'> {/* Bootstrap row for layout */}
                    <div className='col-md-3'> {/* Sidebar column for category filter */}
                    <CategoryFilter
                        selectedCategories={selectedCategories} // Pass selected categories to the filter
                        setSelectedCategories={setSelectedCategories} // Update selected categories
                    />
                    </div>
                    <div className='col-md-9'> {/* Main column for book list */}
                    {/* Include the booklist component so that it displays */}
                    <BookList selectedCategories={selectedCategories} /> {/* Displays books filtered by selected categories */}
                    </div>
                </div>
            </div>
    )
}

export default BookstorePage // Export the component for use in other parts of the app