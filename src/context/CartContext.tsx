"use client";

// ─────────────────────────────────────────────────────────────────────────────
// CartContext
//
// Manages global cart state and persists it to localStorage using LZ-String
// compression. Compression is necessary because large cart objects can approach
// localStorage's 5 MB limit when serialized as plain JSON.
//
// Persistence strategy:
//   1. On mount: read + decompress any saved cart from localStorage.
//   2. On every cartItems change (after mount): compress + write to localStorage.
//      The isFirstLoad ref prevents overwriting the value we just read on step 1.
// ─────────────────────────────────────────────────────────────────────────────

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import LZString from "lz-string"; // Compress cart data before storing in localStorage

export interface CartItem {
  cartId: string;
  name: string;
  quantity: string;
  category?: string;
  size?: string;
}

interface CartContextProps {
  cartItems: CartItem[];
  cartItemCounter: number;
  addToCart: (item: Omit<CartItem, "cartId">) => void;
  removeFromCart: (cartId: string) => void;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Tracks whether the initial localStorage read has completed.
  // Prevents the write effect from overwriting localStorage before the read effect runs.
  const isFirstLoad = useRef(true);

  const cartItemCounter = cartItems.length;

  // ── Step 1: Hydrate cart from localStorage on mount ───────────────────────
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      try {
        const decompressedCart = JSON.parse(
          LZString.decompressFromUTF16(savedCart) || "[]",
        );
        if (Array.isArray(decompressedCart)) {
          // Migration: backfill cartId for items saved before stable IDs were introduced
          const migrated: CartItem[] = decompressedCart.map(
            (item: any, i: number) => ({
              ...item,
              cartId: item.cartId ?? `legacy:${i}:${Date.now()}`,
            }),
          );
          setCartItems(migrated);
        } else {
          console.warn("Invalid cart data in localStorage");
        }
      } catch (error) {
        console.error("Error decompressing cartItems from localStorage:", error);
      }
    }
  }, []);

  // ── Step 2: Persist cart to localStorage on every change (after mount) ───
  useEffect(() => {
    // Skip the first run — the read effect above just populated cartItems,
    // and we don't want to immediately overwrite the stored value.
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    const compressedData = LZString.compressToUTF16(JSON.stringify(cartItems));
    localStorage.setItem("cartItems", compressedData);
  }, [cartItems]);

  /** Append a new item to the cart, generating a stable cartId */
  const addToCart = (item: Omit<CartItem, "cartId">) => {
    const cartId = [item.name, item.category ?? "", item.size ?? "", Date.now()].join(":");
    setCartItems((prev) => [...prev, { ...item, cartId }]);
  };

  /** Remove the cart item with the given stable cartId */
  const removeFromCart = (cartId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  return (
    <CartContext.Provider
      value={{ cartItems, cartItemCounter, addToCart, removeFromCart, setCartItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

/** Hook to access cart state. Must be used inside CartProvider. */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
