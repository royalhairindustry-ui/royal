"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { getOrder } from "@/lib/actions";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Search, 
  MapPin, 
  Clock, 
  ShoppingBag, 
  Loader2,
  Phone,
  Sparkles,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const orderNumberParam = searchParams.get("orderNumber");
  const isSuccess = searchParams.get("success") === "true";

  const [orderNumber, setOrderNumber] = useState(orderNumberParam || "");
  const [order, setOrder] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!orderNumberParam);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderNumberParam) {
      handleSearch(undefined, orderNumberParam);
    }
  }, [orderNumberParam]);

  const handleSearch = async (e?: React.FormEvent, manualOrderNumber?: string) => {
    if (e) e.preventDefault();
    const targetOrderNumber = manualOrderNumber || orderNumber;
    
    if (!targetOrderNumber) return;

    setIsSearching(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await getOrder(targetOrderNumber);
      if (data) {
        setOrder(data);
      } else {
        setOrder(null);
        setError("Order not found. Please check the order number and try again.");
      }
    } catch (err) {
      setError("Failed to fetch order details.");
    } finally {
      setIsSearching(false);
    }
  };

  const steps = [
    { status: "Pending", icon: Clock, label: "Order Placed", description: "We've received your order and are preparing it." },
    { status: "Shipped", icon: Truck, label: "Out for Delivery", description: "Your premium braids are on the way to your doorstep." },
    { status: "Delivered", icon: CheckCircle2, label: "Delivered", description: "Package has been delivered. Enjoy your Royal touch!" },
  ];

  const currentStepIndex = order ? steps.findIndex(s => s.status === order.status) : 0;

  return (
    <div className="min-h-screen bg-[#f6f3ee] px-4 py-8 text-black sm:px-6 sm:py-12 md:py-16">
      <div className="mx-auto max-w-[980px]">
      {isSuccess && !error && order && (
        <div className="mb-10 overflow-hidden rounded-[32px] border border-emerald-100 bg-[linear-gradient(135deg,#ecfff4_0%,#ffffff_48%,#f6f3ee_100%)] shadow-[0_30px_70px_rgba(16,24,40,0.08)] animate-in fade-in zoom-in duration-500">
          <div className="grid gap-6 px-6 py-7 sm:px-8 sm:py-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-700">
                <Sparkles className="h-4 w-4" />
                Order Confirmed
              </div>
              <h1 className="text-[28px] font-black uppercase tracking-tight text-emerald-950 sm:text-[34px]">
                Order Placed Successfully
              </h1>
              <p className="mt-3 max-w-[540px] text-[15px] leading-7 text-emerald-900/75">
                Thank you, {order.customerName}. Your order{" "}
                <span className="font-bold">{order.orderNumber}</span> has been received and is now being prepared.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                    Status
                  </p>
                  <p className="mt-1 text-[16px] font-bold text-black">{order.status}</p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                    Total
                  </p>
                  <p className="mt-1 text-[16px] font-bold text-black">
                    UGX {order.totalCents?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-black/5 bg-black p-6 text-white shadow-xl">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white">
                <CheckCircle2 size={30} />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
                Next Step
              </p>
              <p className="mt-2 text-[20px] font-bold uppercase tracking-tight">
                Track This Order Anytime
              </p>
              <p className="mt-3 text-[14px] leading-6 text-white/70">
                Keep your order number ready. You can return here at any time to view the delivery status.
              </p>
              <a
                href={`#track-order-search`}
                className="mt-5 inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.18em] text-white"
              >
                View tracking section
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 rounded-[32px] border border-black/5 bg-white px-6 py-7 shadow-[0_25px_70px_rgba(15,23,42,0.06)] sm:px-8 sm:py-8">
        <h1 className="text-[32px] font-black text-black uppercase tracking-tight leading-none">Track Your Order</h1>
        <p className="mt-3 text-zinc-500">Enter your order number to see the current status of your delivery.</p>
        
        <form onSubmit={handleSearch} className="mt-8 flex flex-col gap-3 sm:flex-row" id="track-order-search">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="e.g. RB-123456"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="h-14 w-full rounded-2xl border border-transparent bg-zinc-50 pl-12 pr-4 text-[15px] font-medium outline-none transition-all focus:border-black/10 focus:bg-white focus:ring-4 focus:ring-black/5"
            />
          </div>
          <button 
            type="submit"
            disabled={isSearching || !orderNumber}
            className="flex h-14 items-center justify-center rounded-2xl bg-black px-8 text-[15px] font-bold text-white transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : "Track"}
          </button>
        </form>
      </div>

      {hasSearched && !isSearching && !order && error && (
        <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 p-12 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-zinc-300" />
          <p className="text-[16px] font-medium text-zinc-600">{error}</p>
        </div>
      )}

      {order && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Status Tracker */}
          <div className="rounded-[32px] border border-zinc-100 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:p-8">
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-400">Order Status</span>
                <div className="mt-1 flex items-center gap-2">
                  <h3 className="text-[20px] font-bold text-black uppercase">{order.status}</h3>
                  <div className={`h-2 w-2 rounded-full animate-pulse ${order.status === 'Delivered' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-400">Estimated Delivery</span>
                <p className="mt-1 text-[16px] font-bold text-black">Today, 5:00 PM</p>
              </div>
            </div>

            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-[19px] top-0 h-full w-[2px] bg-zinc-100 md:left-0 md:top-[19px] md:h-[2px] md:w-full" />
              <div 
                className="absolute left-[19px] top-0 w-[2px] bg-black transition-all duration-1000 md:left-0 md:top-[19px] md:h-[2px]" 
                style={{ 
                  height: typeof window !== 'undefined' && window.innerWidth < 768 ? `${(currentStepIndex / (steps.length - 1)) * 100}%` : '2px',
                  width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${(currentStepIndex / (steps.length - 1)) * 100}%` : '2px'
                }}
              />

              <div className="relative flex flex-col gap-10 md:flex-row md:justify-between md:gap-4">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={step.status} className="flex items-start gap-4 md:flex-col md:items-center md:text-center">
                      <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white transition-colors duration-500 ${isCompleted ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                        <Icon size={18} />
                      </div>
                      <div className="md:mt-2">
                        <p className={`text-[14px] font-bold uppercase tracking-tight ${isCompleted ? 'text-black' : 'text-zinc-400'}`}>{step.label}</p>
                        <p className="mt-1 text-[12px] text-zinc-500 max-w-[150px]">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Delivery Details */}
            <div className="rounded-[32px] border border-zinc-100 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:p-8">
              <h4 className="mb-6 flex items-center gap-2 text-[16px] font-bold text-black uppercase tracking-tight">
                <MapPin className="h-4 w-4" />
                Delivery Details
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">Customer</p>
                  <p className="text-[15px] font-medium text-black">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">Ship To</p>
                  <p className="text-[15px] font-medium text-black">{order.address}, {order.city}</p>
                </div>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">Contact</p>
                  <div className="flex items-center gap-2 text-[15px] font-medium text-black">
                    <Phone className="h-3 w-3" />
                    {order.phone}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="rounded-[32px] border border-zinc-100 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:p-8">
              <h4 className="mb-6 flex items-center gap-2 text-[16px] font-bold text-black uppercase tracking-tight">
                <ShoppingBag className="h-4 w-4" />
                Items Ordered
              </h4>
              <div className="space-y-4 max-h-[160px] overflow-y-auto pr-2 scrollbar-hide">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-zinc-50 pb-2 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-zinc-50">
                        {item.image && <img src={item.image} className="h-full w-full object-cover" />}
                      </div>
                      <p className="text-[13px] font-medium text-black line-clamp-1">{item.name}</p>
                    </div>
                    <span className="text-[13px] font-bold text-zinc-400">x{item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-zinc-50 pt-4 flex justify-between">
                <span className="text-[14px] font-bold uppercase text-black">Total Paid</span>
                <span className="text-[16px] font-black text-black">UGX {order.totalCents?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-300" />
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}
