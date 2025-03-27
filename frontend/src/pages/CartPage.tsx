// Importing necessary modules and hooks
import { useNavigate } from "react-router-dom"; // For navigation between routes
import { useCart } from "../context/CartContext"; // Custom hook to access cart context
import { CartItem } from "../types/CartItem"; // Type definition for cart items

function CartPage () {
    // Hook to navigate between pages
    const navigate = useNavigate();

    // Destructuring cart-related functions and data from the cart context
    const { cart, removeFromCart, incrementQuantity, decrementQuantity } = useCart();

    // Calculating the total amount of items in the cart
    const totalAmount = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

    return (
        <>
            <div>
                <h2>Your cart</h2>
                <div>
                    {/* Conditional rendering: Show a message if the cart is empty, otherwise display the cart items */}
                    {cart.length === 0 ?
                    <h3>Your cart is empty.</h3> : 
                    <ul className="list-unstyled list-group-flush">
                        {/* Mapping through the cart items and rendering each item */}
                        {cart.map((item: CartItem) => 
                            <li className="list-group-item" key={item.bookID}>
                                {/* Displaying the item title and price */}
                                {item.title}: ${item.price.toFixed(2)}
                                
                                {/* Button to decrement the quantity of the item */}
                                <button 
                                    style={{ margin: '0 10px 0 20px' }} 
                                    className="btn btn-danger" 
                                    onClick={() => decrementQuantity(item.bookID)}
                                >
                                    -
                                </button>

                                {/* Displaying the current quantity of the item */}
                                <span style={{ margin: '0 10px' }}>{item.quantity}</span>

                                {/* Button to increment the quantity of the item */}
                                <button 
                                    style={{ margin: '0 10px' }} 
                                    className="btn btn-success" 
                                    onClick={() => incrementQuantity(item.bookID)}
                                >
                                    +
                                </button>

                                {/* Button to remove the item from the cart */}
                                <button 
                                    style={{ margin: '0 10px' }} 
                                    className="btn btn-light" 
                                    onClick={() => removeFromCart(item.bookID)}
                                >
                                    Remove
                                </button>
                            </li>
                        )}
                    </ul>}
                </div>

                {/* Displaying the total amount */}
                <h3>Total: ${totalAmount.toFixed(2)}</h3>

                {/* Button to proceed to checkout */}
                <button>Checkout</button>

                {/* Button to navigate back to the bookstore */}
                <button onClick={() => navigate('/bookstore')}>Continue Browsing</button>
            </div>
        </>
    );
}

export default CartPage; // Exporting the CartPage component