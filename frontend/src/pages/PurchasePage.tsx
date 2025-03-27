import { useNavigate, useParams } from "react-router-dom";
import WelcomeBand from "../components/WelcomeBand";
import { useCart } from "../context/CartContext";
import { CartItem } from "../types/CartItem";
import { useState } from "react";

function PurchasePage () {
    // Establish all of our variables
    const navigate = useNavigate();
    const { title, bookID, price } = useParams();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState<number>(1);

    // Establish our function to handle adding items to the cart
    const handleAddToCart = () => {
        const newItem: CartItem = {
            bookID: Number(bookID),
            title: title || "No Book Found",
            price: Number(price),
            quantity: quantity,
        };
        addToCart(newItem);
        navigate('/cart');
        };

        // Create functions for incrementing and decrementing quantity using setQuantity
        const incrementQuantity = () => setQuantity(prev => prev + 1);
        const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

    return (
        // Establish the overall structure of the page
        <>
        <WelcomeBand />
        <br/><br/>
        <div>
            <p>{title}: ${price} </p>
            <br/>
            <div>
                {/* SUPER AWESOME COOL BUTTON STYLING */}
                <button style={{ margin: '0 10px' }} className="btn btn-danger" onClick={decrementQuantity}>-</button>
                <span style={{ margin: '0 10px' }}>{quantity}</span>
                <button style={{ margin: '0 10px 0 20px' }} className="btn btn-success" onClick={incrementQuantity}>+</button>
            </div>
            <br/>
            <button onClick={handleAddToCart}>Add to Cart</button>
        </div>

        <button onClick={() => navigate(-1)}>Go Back</button>
        </>
    )
}

export default PurchasePage;