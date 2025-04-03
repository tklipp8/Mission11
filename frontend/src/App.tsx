import './App.css' // Importing the main CSS file for styling
import BookstorePage from './pages/BookstorePage' // Importing the BookstorePage component
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom' // Importing React Router components for navigation
import PurchasePage from './pages/PurchasePage' // Importing the PurchasePage component
import CartPage from './pages/CartPage' // Importing the CartPage component
import BookManagementPage from './pages/BookManagementPage' // Importing the BookManagementPage component
import { CartProvider } from './context/CartContext' // Importing the CartProvider for managing cart state globally

function App() {


  return (
    <>
    {/* Wrapping the application with CartProvider to provide cart context to all components */}
    <CartProvider>
      {/* Wrapping the application with Router to enable routing */}
      <Router>
        <Routes>
          {/* Route for the homepage, rendering the BookstorePage component */}
          <Route path="/" element={<BookstorePage/>} />
          {/* Route for the bookstore page, also rendering the BookstorePage component */}
          <Route path="/bookstore" element={<BookstorePage/>} />
          {/* Route for the purchase page, rendering the PurchasePage component with dynamic parameters */}
          <Route path="/purchase/:title/:bookID/:price" element={<PurchasePage/>} />
          {/* Route for the cart page, rendering the CartPage component */}
          <Route path='/cart' element={<CartPage/>} />
          {/* Route for the book management page */}
          <Route path='/manage-books' element={<BookManagementPage/>} />
        </Routes>
      </Router>
    </CartProvider>
    </>
  )
}

export default App // Exporting the App component as the default export