"use client";

import { useCart } from "@/app/context/CartContext";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";

type AddToCartButtonProps = {
  product: {
    id: number;
    name: string;
    price: number;
    image: string | null;
    unitLabel?: string;
    cartKey?: string;
  };
  className?: string;
  showText?: boolean;
}

export default function AddToCartButton({ product, className = "", showText = false }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      cartKey: product.cartKey || `${product.id}:${product.unitLabel || "default"}`,
      id: product.id,
      name: product.name,
      unitLabel: product.unitLabel,
      price: product.price,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      className={`group flex items-center justify-center gap-2 transition-all duration-300 ${className} ${
        added ? "bg-emerald-500 text-white" : "bg-black text-white hover:bg-zinc-800"
      }`}
    >
      {added ? <Check size={16} /> : <ShoppingBag size={16} />}
      {showText && (added ? "Added!" : "Add to Bag")}
    </button>
  );
}
