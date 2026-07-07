"use client";

import { useCart } from "@/app/context/CartContext";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Drawer */}
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 p-6">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5 text-black" />
            <h2 className="text-[18px] font-bold text-black uppercase tracking-tight">
              My Bag ({totalItems})
            </h2>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="rounded-full p-2 transition-colors hover:bg-zinc-50"
          >
            <X className="h-6 w-6 text-black" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-6 rounded-full bg-zinc-50 p-8">
                <ShoppingBag className="h-10 w-10 text-zinc-300" />
              </div>
              <h3 className="text-[18px] font-bold text-black">Your bag is empty</h3>
              <p className="mt-2 text-[14px] text-zinc-500">
                Sounds like a good time to start shopping.
              </p>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="mt-8 rounded-full bg-black px-8 py-3 text-[14px] font-bold text-white transition hover:bg-zinc-800"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.cartKey} className="flex gap-4 border-b border-zinc-50 pb-6 last:border-0">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[4px] bg-zinc-50">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-zinc-100 font-bold text-zinc-300 uppercase">
                        {item.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-[14px] font-bold text-black leading-tight uppercase tracking-tight line-clamp-2">
                        {item.name}
                      </h4>
                      <button 
                        onClick={() => removeFromCart(item.cartKey)}
                        className="text-zinc-300 transition-colors hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {item.unitLabel ? (
                      <p className="mt-1 text-[12px] uppercase tracking-wide text-zinc-500">
                        {item.unitLabel}
                      </p>
                    ) : null}
                    
                    <p className="mt-1 text-[13px] font-bold text-black">
                      UGX {item.price.toLocaleString()}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-zinc-200 bg-white">
                        <button 
                          onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center text-black hover:bg-zinc-50 rounded-full"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-[13px] font-bold text-black">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center text-black hover:bg-zinc-50 rounded-full"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-[14px] font-black text-black">
                        UGX {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-zinc-100 bg-white p-6 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[14px] font-medium text-zinc-500 uppercase tracking-widest">Subtotal</span>
              <span className="text-[18px] font-black text-black">UGX {totalPrice.toLocaleString()}</span>
            </div>
            <p className="mb-6 text-[12px] text-zinc-400 italic">
              * Delivery calculated at checkout. Free in Kampala.
            </p>
            <div className="space-y-3">
              <Link 
                href="/cart"
                onClick={() => setIsCartOpen(false)}
                className="flex w-full items-center justify-center rounded-full border border-zinc-200 py-4 text-[15px] font-bold uppercase tracking-widest text-black transition hover:bg-zinc-50"
              >
                View Cart
              </Link>
              <Link 
                href="/checkout" 
                onClick={() => setIsCartOpen(false)}
                className="flex w-full items-center justify-center rounded-full bg-black py-4 text-[15px] font-bold uppercase tracking-widest text-white transition hover:bg-zinc-800"
              >
                Checkout Now
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
