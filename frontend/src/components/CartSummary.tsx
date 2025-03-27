import { useNavigate } from "react-router-dom"; // Importing the navigation hook from React Router
import { useCart } from "../context/CartContext"; // Importing the custom hook to access cart context

const CartSummary = () => {
    const navigate = useNavigate(); // Hook to programmatically navigate between routes
    const { cart } = useCart(); // Accessing the cart data from the context

    // Calculating the total amount by summing up the price * quantity for each item in the cart
    const totalAmount = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

    return (
        <div
            style={{
                position: 'fixed', // Fixing the position of the cart summary on the screen
                top: '10px', // Positioning it 10px from the top
                right: '20px', // Positioning it 20px from the right
                background: '#f8f9fa', // Setting a light background color
                padding: '10px 15px', // Adding padding for spacing
                borderRadius: '8px', // Rounding the corners
                cursor: 'pointer', // Changing the cursor to a pointer to indicate it's clickable
                display: 'flex', // Using flexbox for layout
                alignItems: 'center', // Aligning items vertically in the center
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)', // Adding a subtle shadow for a raised effect
                fontSize: '16px', // Setting the font size
            }}
            onClick={() => navigate('/cart')} // Navigating to the cart page when clicked
        >
            🛒 <strong>{totalAmount.toFixed(2)}</strong> {/* Displaying the total amount with 2 decimal places */}
        </div>
    );
}

export default CartSummary; // Exporting the component for use in other parts of the application