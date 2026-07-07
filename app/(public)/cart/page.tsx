"use client";

import Link from "next/link";
import {
  ChevronLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useCart } from "@/app/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#f6f3ee] px-6 py-16 text-black">
        <div className="mx-auto flex min-h-[70vh] max-w-[760px] flex-col items-center justify-center rounded-[36px] border border-black/5 bg-white px-8 py-14 text-center shadow-[0_30px_80px_rgba(16,24,40,0.08)]">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#f3ede4] text-black">
            <ShoppingBag size={44} strokeWidth={1.5} />
          </div>
          <h1 className="text-[28px] font-black uppercase tracking-tight text-black sm:text-[34px]">
            Your Cart Is Empty
          </h1>
          <p className="mt-3 max-w-[460px] text-[15px] leading-7 text-zinc-600">
            Add products to your bag to continue to checkout.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex h-14 items-center justify-center rounded-full bg-black px-8 text-[13px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-zinc-800"
          >
            Shop Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f3ee] text-black">
      <div className="mx-auto max-w-[1380px] px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <div className="overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-[0_35px_90px_rgba(15,23,42,0.08)]">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <section className="bg-[linear-gradient(180deg,#fffdf9_0%,#ffffff_100%)] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
              <div className="mb-8 flex items-start justify-between gap-4 border-b border-zinc-100 pb-6">
                <div className="flex items-start gap-4">
                  <Link
                    href="/products"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-black transition hover:border-black hover:bg-zinc-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Link>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#9b7b46]">
                      Shopping Bag
                    </p>
                    <h1 className="mt-2 text-[30px] font-black uppercase tracking-tight text-black sm:text-[40px]">
                      Review Your Cart
                    </h1>
                    <p className="mt-3 text-[14px] leading-6 text-zinc-600 sm:text-[15px]">
                      {totalItems} item{totalItems === 1 ? "" : "s"} selected. Adjust quantities before moving to checkout.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8 grid gap-3 sm:grid-cols-3">
                <InfoCard
                  icon={<Truck className="h-5 w-5 text-black" />}
                  title="Delivery"
                  value="Calculated at checkout"
                  tone="bg-[#fbf8f2]"
                />
                <InfoCard
                  icon={<ShieldCheck className="h-5 w-5 text-black" />}
                  title="Checkout"
                  value="Secure order flow"
                  tone="bg-[#f7f2fb]"
                />
                <InfoCard
                  icon={<ShoppingBag className="h-5 w-5 text-black" />}
                  title="Subtotal"
                  value={`UGX ${totalPrice.toLocaleString()}`}
                  tone="bg-[#f2f7f5]"
                />
              </div>

              <div className="space-y-4">
                {cart.map((item) => (
                  <article
                    key={item.cartKey}
                    className="flex flex-col gap-4 rounded-[28px] border border-zinc-200 bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.04)] sm:flex-row sm:p-5"
                  >
                    <div className="h-32 w-full overflow-hidden rounded-[22px] bg-zinc-50 sm:h-32 sm:w-28 sm:shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-zinc-100 font-bold uppercase text-zinc-300">
                          {item.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-[16px] font-bold uppercase tracking-tight text-black sm:text-[18px]">
                            {item.name}
                          </h2>
                          {item.unitLabel ? (
                            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-zinc-500 sm:text-[12px]">
                              {item.unitLabel}
                            </p>
                          ) : null}
                          <p className="mt-3 text-[15px] font-bold text-black">
                            UGX {item.price.toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartKey)}
                          className="rounded-full p-2 text-zinc-300 transition hover:bg-red-50 hover:text-red-500"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="inline-flex items-center rounded-full border border-zinc-200 bg-[#fcfbf8]">
                          <button
                            onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                            className="flex h-11 w-11 items-center justify-center rounded-full text-black transition hover:bg-zinc-100"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center text-[14px] font-bold text-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                            className="flex h-11 w-11 items-center justify-center rounded-full text-black transition hover:bg-zinc-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <p className="text-[18px] font-black text-black">
                          UGX {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="border-t border-zinc-200 bg-[#111111] px-5 py-6 text-white sm:px-8 sm:py-8 lg:sticky lg:top-0 lg:h-screen lg:border-l lg:border-t-0 lg:px-8 lg:py-10">
              <div className="mx-auto flex h-full max-w-[520px] flex-col">
                <div className="mb-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/45">
                    Order Summary
                  </p>
                  <h2 className="mt-2 text-[28px] font-black uppercase tracking-tight text-white">
                    Ready For Checkout
                  </h2>
                  <p className="mt-3 text-[14px] leading-6 text-white/65">
                    Review your totals and continue when you are ready to place the order.
                  </p>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="space-y-4 text-[14px]">
                    <div className="flex items-center justify-between text-white/65">
                      <span className="uppercase tracking-[0.16em]">Items</span>
                      <span className="font-bold text-white">{totalItems}</span>
                    </div>
                    <div className="flex items-center justify-between text-white/65">
                      <span className="uppercase tracking-[0.16em]">Subtotal</span>
                      <span className="font-bold text-white">
                        UGX {totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-white/65">
                      <span className="uppercase tracking-[0.16em]">Delivery</span>
                      <span className="font-bold text-emerald-400">
                        Calculated at checkout
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-[13px] font-bold uppercase tracking-[0.22em] text-white/55">
                        Total
                      </span>
                      <span className="text-[24px] font-black text-white">
                        UGX {totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Link
                    href="/checkout"
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-white text-[13px] font-bold uppercase tracking-[0.2em] text-black transition hover:bg-zinc-200"
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/products"
                    className="flex h-14 w-full items-center justify-center rounded-full border border-white/15 text-[13px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-white/5"
                  >
                    Continue Shopping
                  </Link>
                </div>

                <div className="mt-auto pt-6">
                  <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-[13px] leading-6 text-white/65">
                    Royal Braids confirms delivery fees at checkout. Kampala orders may qualify for free delivery.
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  value,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  tone: string;
}) {
  return (
    <div className={`rounded-[24px] border border-zinc-200 p-4 ${tone}`}>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
        {icon}
      </div>
      <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-zinc-500">
        {title}
      </p>
      <p className="mt-2 text-[15px] font-semibold text-black">{value}</p>
    </div>
  );
}
