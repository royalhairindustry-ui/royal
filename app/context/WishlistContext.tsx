"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type WishlistItem = {
  id: number;
  slug: string;
  name: string;
  image: string | null;
  price: number;
  unitLabel?: string;
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isWishlisted: (id: number) => boolean;
  clearWishlist: () => void;
  totalWishlistItems: number;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedWishlist = localStorage.getItem("royal_braids_wishlist");
    if (savedWishlist) {
      try {
        const parsed = JSON.parse(savedWishlist) as WishlistItem[];
        setWishlist(parsed);
      } catch (error) {
        console.error("Failed to parse wishlist", error);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("royal_braids_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isInitialized]);

  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prev) => (prev.some((entry) => entry.id === item.id) ? prev : [...prev, item]));
  };

  const removeFromWishlist = (id: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleWishlist = (item: WishlistItem) => {
    setWishlist((prev) =>
      prev.some((entry) => entry.id === item.id)
        ? prev.filter((entry) => entry.id !== item.id)
        : [...prev, item]
    );
  };

  const isWishlisted = (id: number) => wishlist.some((item) => item.id === id);
  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isWishlisted,
        clearWishlist,
        totalWishlistItems: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
}
