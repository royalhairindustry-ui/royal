"use client";

import { useCart } from "@/app/context/CartContext";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/actions";

export default function CheckoutPage() {
  const { cart, totalPrice, totalItems, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "Kampala",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deliveryLabel = useMemo(() => {
    return formData.city === "Kampala" ? "Free delivery" : "Delivery confirmed after checkout";
  }, [formData.city]);

  if (cart.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen bg-[#f6f3ee] px-6 py-16 text-black">
        <div className="mx-auto flex min-h-[70vh] max-w-[760px] flex-col items-center justify-center rounded-[36px] border border-black/5 bg-white px-8 py-14 text-center shadow-[0_30px_80px_rgba(16,24,40,0.08)]">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#f3ede4] text-black">
            <ShoppingBag size={44} strokeWidth={1.5} />
          </div>
          <h1 className="text-[28px] font-black uppercase tracking-tight text-black sm:text-[34px]">
            Your Bag Is Empty
          </h1>
          <p className="mt-3 max-w-[460px] text-[15px] leading-7 text-zinc-600">
            Add Royal Braids products to your bag before continuing to checkout.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex h-14 items-center justify-center rounded-full bg-black px-8 text-[13px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-zinc-800"
          >
            Return To Store
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await createOrder({
      ...formData,
      items: cart,
      totalPrice,
    });

    if (result.success) {
      clearCart();
      router.push(`/track-order?orderNumber=${result.orderNumber}&success=true`);
      return;
    }

    setError(result.error || "Something went wrong. Please try again.");
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#f6f3ee] text-black">
      <div className="mx-auto max-w-[1380px] px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <div className="overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-[0_35px_90px_rgba(15,23,42,0.08)]">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="bg-[linear-gradient(180deg,#fffdf9_0%,#ffffff_100%)] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
              <div className="mb-8 flex items-start justify-between gap-4 border-b border-zinc-100 pb-6">
                <div className="flex items-start gap-4">
                  <Link
                    href="/cart"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-black transition hover:border-black hover:bg-zinc-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Link>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#9b7b46]">
                      Secure Checkout
                    </p>
                    <h1 className="mt-2 text-[30px] font-black uppercase tracking-tight text-black sm:text-[40px]">
                      Complete Your Order
                    </h1>
                    <p className="mt-3 max-w-[560px] text-[14px] leading-6 text-zinc-600 sm:text-[15px]">
                      Fast delivery, clean checkout, and a lighter page design that stays readable on every device.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[24px] border border-zinc-200 bg-[#fbf8f2] p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                    <Truck className="h-5 w-5 text-black" />
                  </div>
                  <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                    Delivery
                  </p>
                  <p className="mt-2 text-[15px] font-semibold text-black">{deliveryLabel}</p>
                </div>

                <div className="rounded-[24px] border border-zinc-200 bg-[#f7f2fb] p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                    <ShieldCheck className="h-5 w-5 text-black" />
                  </div>
                  <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                    Payment
                  </p>
                  <p className="mt-2 text-[15px] font-semibold text-black">Pay on delivery</p>
                </div>

                <div className="rounded-[24px] border border-zinc-200 bg-[#f2f7f5] p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                    <ShoppingBag className="h-5 w-5 text-black" />
                  </div>
                  <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                    Items
                  </p>
                  <p className="mt-2 text-[15px] font-semibold text-black">
                    {totalItems} item{totalItems === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {error ? (
                  <div className="rounded-[22px] border border-red-100 bg-red-50 px-4 py-3 text-[14px] font-medium text-red-600">
                    {error}
                  </div>
                ) : null}

                <section className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)] sm:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-[13px] font-bold text-white">
                      1
                    </div>
                    <div>
                      <h2 className="text-[20px] font-bold uppercase tracking-tight text-black">
                        Delivery Information
                      </h2>
                      <p className="text-[13px] text-zinc-500">
                        Enter the contact and address details for this order.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Full Name"
                      icon={<ShoppingBag className="h-4 w-4" />}
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="e.g. Sarah Nakato"
                    />
                    <Field
                      label="Phone Number"
                      icon={<Phone className="h-4 w-4" />}
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 0770 000 000"
                    />
                    <div className="sm:col-span-2">
                      <Field
                        label="Email Address"
                        icon={<Mail className="h-4 w-4" />}
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. sarah@example.com"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                        City / Region
                      </label>
                      <div className="rounded-[20px] border border-zinc-200 bg-[#fcfbf8] px-4">
                        <select
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="h-14 w-full appearance-none bg-transparent text-[14px] font-medium text-black outline-none"
                        >
                          <option value="Kampala">Kampala (Free Delivery)</option>
                          <option value="Entebbe">Entebbe</option>
                          <option value="Wakiso">Wakiso</option>
                          <option value="Mukono">Mukono</option>
                          <option value="Jinja">Jinja</option>
                          <option value="Other">Other Region</option>
                        </select>
                      </div>
                    </div>
                    <Field
                      label="Street / Area Details"
                      icon={<MapPin className="h-4 w-4" />}
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="House No, Street, Landmark"
                    />
                  </div>
                </section>

                <section className="rounded-[28px] border border-zinc-200 bg-[#faf7f2] p-5 sm:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-[13px] font-bold text-white">
                      2
                    </div>
                    <div>
                      <h2 className="text-[20px] font-bold uppercase tracking-tight text-black">
                        Payment Method
                      </h2>
                      <p className="text-[13px] text-zinc-500">
                        Royal Braids confirms payment when your order arrives.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-black/10 bg-white p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[16px] font-bold text-black">Pay on Delivery</p>
                        <p className="mt-1 text-[14px] leading-6 text-zinc-600">
                          Inspect your premium braids before paying. Royal Braids accepts cash or mobile money on delivery.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-15 w-full items-center justify-center gap-3 rounded-full bg-black px-6 text-[14px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 sm:h-16 sm:text-[15px]"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5" />
                  )}
                  {isSubmitting ? "Processing..." : `Place Order • UGX ${totalPrice.toLocaleString()}`}
                </button>
              </form>
            </div>

            <aside className="border-t border-zinc-200 bg-[#111111] px-5 py-6 text-white sm:px-8 sm:py-8 lg:sticky lg:top-0 lg:h-screen lg:border-l lg:border-t-0 lg:px-8 lg:py-10">
              <div className="mx-auto flex h-full max-w-[540px] flex-col">
                <div className="mb-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/45">
                    Order Summary
                  </p>
                  <h2 className="mt-2 text-[28px] font-black uppercase tracking-tight text-white">
                    Your Royal Cart
                  </h2>
                  <p className="mt-3 text-[14px] leading-6 text-white/65">
                    Review the products in your order before confirming checkout.
                  </p>
                </div>

                <div className="scrollbar-hide flex-1 space-y-4 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.cartKey}
                      className="flex gap-4 rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                    >
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[18px] bg-white/10">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center font-bold uppercase text-white/30">
                            {item.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <h4 className="line-clamp-1 text-[14px] font-bold uppercase tracking-tight text-white">
                          {item.name}
                        </h4>
                        {item.unitLabel ? (
                          <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/45">
                            {item.unitLabel}
                          </p>
                        ) : null}
                        <p className="mt-2 text-[13px] text-white/70">Qty: {item.quantity}</p>
                        <p className="mt-2 text-[15px] font-bold text-white">
                          UGX {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="space-y-4 text-[14px]">
                    <div className="flex items-center justify-between text-white/65">
                      <span className="uppercase tracking-[0.16em]">Total Items</span>
                      <span className="font-bold text-white">{totalItems}</span>
                    </div>
                    <div className="flex items-center justify-between text-white/65">
                      <span className="uppercase tracking-[0.16em]">Delivery Fee</span>
                      <span className="font-bold text-emerald-400">
                        {formData.city === "Kampala" ? "FREE" : "To confirm"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-[13px] font-bold uppercase tracking-[0.22em] text-white/55">
                        Grand Total
                      </span>
                      <span className="text-[24px] font-black text-white">
                        UGX {totalPrice.toLocaleString()}
                      </span>
                    </div>
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

function Field({
  label,
  icon,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  icon: React.ReactNode;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </label>
      <div className="flex items-center gap-3 rounded-[20px] border border-zinc-200 bg-[#fcfbf8] px-4">
        <span className="text-zinc-400">{icon}</span>
        <input
          type={type}
          name={name}
          required
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-14 w-full bg-transparent text-[14px] font-medium text-black outline-none placeholder:text-zinc-400"
        />
      </div>
    </div>
  );
}
