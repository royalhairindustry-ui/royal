"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CartItem = {
  cartKey: string;
  id: number;
  name: string;
  unitLabel?: string;
  price: number;
  image: string | null;
  quantity: number;
}

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem("royal_braids_cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart) as Array<Partial<CartItem>>;
        setCart(
          parsed.map((item) => ({
            cartKey: item.cartKey || `${item.id}:${item.unitLabel || "default"}`,
            id: item.id || 0,
            name: item.name || "Product",
            unitLabel: item.unitLabel,
            price: item.price || 0,
            image: item.image || null,
            quantity: item.quantity || 1,
          }))
        );
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("royal_braids_cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.cartKey === item.cartKey);
      if (existing) {
        return prev.map((i) => i.cartKey === item.cartKey ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartKey: string) => {
    setCart((prev) => prev.filter((i) => i.cartKey !== cartKey));
  };

  const updateQuantity = (cartKey: string, quantity: number) => {
    if (quantity < 1) {
      setCart((prev) => prev.filter((i) => i.cartKey !== cartKey));
      return;
    }
    setCart((prev) => prev.map((i) => i.cartKey === cartKey ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      isCartOpen, setIsCartOpen, totalItems, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
