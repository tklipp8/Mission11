import { createContext, ReactNode, useContext, useState } from "react";
import { CartItem } from "../types/CartItem";

// Define the shape of the context, including the cart state and all the functions to manipulate it.
interface CartContextType {
  cart: CartItem[]; // Array of items in the cart
  addToCart: (item: CartItem) => void; // Function to add an item to the cart
  removeFromCart: (bookID: number) => void; // Function to remove an item from the cart by its ID
  clearCart: () => void; // Function to clear all items from the cart
  incrementQuantity: (bookID: number) => void; // Function to increase the quantity of an item
  decrementQuantity: (bookID: number) => void; // Function to decrease the quantity of an item
}

// Create the context with an initial value of undefined, ensuring type safety.
const CartContext = createContext<CartContextType | undefined>(undefined);

// The provider component that wraps around parts of the app needing access to the cart context.
export const CartProvider = ({ children }: { children: ReactNode }) => {
  // State to hold the cart items, initialized as an empty array.
  const [cart, setCart] = useState<CartItem[]>([]);

  // Function to add an item to the cart.
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((b) => b.bookID === item.bookID); // Check if the item already exists in the cart
      if (existingItem) {
        // If the item exists, increment its quantity.
        return prevCart.map((b) =>
          b.bookID === item.bookID
            ? { ...b, quantity: (b.quantity || 1) + (item.quantity || 1) }
            : b
        );
      } else {
        // If the item doesn't exist, add it to the cart with a default quantity of 1.
        return [...prevCart, { ...item, quantity: item.quantity || 1 }];
      }
    });
  };

  // Function to remove an item from the cart by its ID.
  const removeFromCart = (bookID: number) => {
    setCart((prevCart) => prevCart.filter((c) => c.bookID !== bookID));
  };

  // Function to clear all items from the cart.
  const clearCart = () => {
    setCart([]); // Reset the cart to an empty array.
  };

  // Function to increment the quantity of an item in the cart.
  const incrementQuantity = (bookID: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.bookID === bookID
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  // Function to decrement the quantity of an item in the cart.
  // If the quantity reaches 0, the item is removed from the cart.
  const decrementQuantity = (bookID: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.bookID === bookID) {
            const newQuantity = (item.quantity || 1) - 1; // Decrease the quantity
            return { ...item, quantity: newQuantity };
          }
          return item; // Return the item unchanged if it doesn't match the ID
        })
        .filter((item) => (item.quantity || 0) > 0) // Remove items with a quantity of 0
    );
  };

  // Provide the cart state and functions to the children components.
  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        incrementQuantity,
        decrementQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context in components.
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    // Throw an error if the hook is used outside of the CartProvider.
    throw new Error("useCart must be used within a CartProvider");
  }
  return context; // Return the context value.
};