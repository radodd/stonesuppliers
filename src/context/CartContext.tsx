"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import LZString from "lz-string";

interface CartItem {
  // id: string;
  name: string;
  quantity: string;
  category?: string;
  size?: string;
}
interface CartContextProps {
  cartItems: CartItem[];
  cartItemCounter: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const isFirstLoad = useRef(true);

  const cartItemCounter = cartItems.length;

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      try {
        const decompressedCart = JSON.parse(
          LZString.decompressFromUTF16(savedCart) || "[]",
        );
        if (Array.isArray(decompressedCart)) {
          setCartItems(decompressedCart);
        } else {
          console.warn("Invalid cart data in localStorage");
        }
      } catch (error) {
        console.error(
          "Error decompressing cartItems form localStorage:",
          error,
        );
      }
    }
  }, []);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    const compressedData = LZString.compressToUTF16(JSON.stringify(cartItems));
    localStorage.setItem("cartItems", compressedData);
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
  };

  const removeFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemCounter,
        addToCart,
        removeFromCart,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
