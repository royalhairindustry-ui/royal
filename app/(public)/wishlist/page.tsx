"use client";

import Link from "next/link";
import { ChevronLeft, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "@/app/context/WishlistContext";
import { useCart } from "@/app/context/CartContext";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-6 rounded-full bg-zinc-50 p-8 text-black">
          <Heart size={48} strokeWidth={1.5} />
        </div>
        <h1 className="text-[24px] font-bold uppercase tracking-tight text-black">Your wishlist is empty</h1>
        <p className="mt-2 text-zinc-500">Save products you love and come back to them later.</p>
        <Link
          href="/products"
          className="mt-8 rounded-full bg-black px-10 py-4 text-[14px] font-bold uppercase tracking-widest text-white transition hover:bg-zinc-800"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12 md:py-20">
      <div className="mb-12 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-100 bg-white shadow-sm transition hover:bg-zinc-50">
            <ChevronLeft className="h-5 w-5 text-black" />
          </Link>
          <div>
            <h1 className="text-[30px] font-black uppercase tracking-tight text-black sm:text-[40px]">Wishlist</h1>
            <p className="mt-2 text-[14px] text-zinc-500">{wishlist.length} saved item{wishlist.length === 1 ? "" : "s"}.</p>
          </div>
        </div>

        <button
          onClick={clearWishlist}
          className="rounded-full border border-zinc-200 px-5 py-3 text-[12px] font-bold uppercase tracking-widest text-black transition hover:bg-zinc-50"
        >
          Clear Wishlist
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {wishlist.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm">
            <Link href={`/products/${item.slug}`} className="block aspect-[4/5] overflow-hidden bg-zinc-100">
              {item.image ? (
                <img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
              ) : (
                <div className="flex h-full items-center justify-center bg-zinc-100 text-[80px] font-black uppercase text-zinc-300">
                  {item.name.charAt(0)}
                </div>
              )}
            </Link>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[18px] font-bold uppercase tracking-tight text-black">
                    <Link href={`/products/${item.slug}`} className="hover:underline underline-offset-4">
                      {item.name}
                    </Link>
                  </h2>
                  {item.unitLabel ? (
                    <p className="mt-2 text-[12px] uppercase tracking-[0.2em] text-zinc-500">{item.unitLabel}</p>
                  ) : null}
                  <p className="mt-3 text-[18px] font-black text-black">UGX {item.price.toLocaleString()}</p>
                </div>

                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="rounded-full p-2 text-zinc-300 transition hover:bg-red-50 hover:text-red-500"
                  aria-label={`Remove ${item.name} from wishlist`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() =>
                    addToCart({
                      cartKey: `${item.id}:${item.unitLabel || "default"}`,
                      id: item.id,
                      name: item.name,
                      unitLabel: item.unitLabel,
                      price: item.price,
                      image: item.image,
                    })
                  }
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-black text-[12px] font-bold uppercase tracking-widest text-white transition hover:bg-zinc-800"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to Cart
                </button>
                <Link
                  href={`/products/${item.slug}`}
                  className="flex h-12 items-center justify-center rounded-full border border-zinc-200 text-[12px] font-bold uppercase tracking-widest text-black transition hover:bg-zinc-50"
                >
                  View Product
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
