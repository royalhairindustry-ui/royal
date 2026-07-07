"use client";

import React from "react";
import Link from "next/link";
import {
  Package2,
  AlertCircle,
  Paperclip,
  ChevronRight,
  Send,
  MapPin,
  Phone,
  Mail,
  Clock
} from "lucide-react";

export default function ContactFormPage() {
  const quickLinks = [
    "Can I cancel or edit my order?",
    "Start a return",
    "Product Recommendations",
    "What is your return policy?",
    "How do I file a claim with Shipping...",
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-black">
      <div className="px-6 py-8 mx-auto w-[90%]">
        {/* Breadcrumb */}
        <div className="mb-3 text-[11px] text-zinc-500 uppercase tracking-widest">
          <Link href="/" className="hover:text-black transition-colors">Home</Link> / Contact Form
        </div>

        {/* Page Title */}
        <h1 className="mb-10 text-[42px] font-semibold tracking-tight">
          Contact Form
        </h1>

        {/* Main two-column layout */}
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* Left column: FAQ + Cards */}
            <div className="flex flex-col gap-6">
              {/* FAQ Buttons */}
              <div className="flex flex-col gap-3">
                {quickLinks.map((item, index) => (
                  <Link
                    key={index}
                    href="/help"
                    className="flex h-[64px] items-center justify-between rounded-md border border-gray-300 bg-white px-6 text-left text-[14px] font-medium text-black transition hover:border-black group"
                  >
                    <span className="truncate">{item}</span>
                    <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-black transition-colors" />
                  </Link>
                ))}
              </div>

              {/* Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/track-order"
                  className="flex h-[160px] flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm hover:border-black hover:shadow-md transition-all group"
                >
                  <div className="mb-4 rounded-full bg-zinc-50 p-4 group-hover:bg-zinc-100 transition-colors">
                    <Package2 className="h-10 w-10 stroke-[1] text-black" />
                  </div>
                  <p className="text-[18px] font-semibold uppercase tracking-tight">Track order</p>
                </Link>

                <button className="flex h-[160px] flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm hover:border-black hover:shadow-md transition-all group">
                  <div className="mb-4 rounded-full bg-zinc-50 p-4 group-hover:bg-zinc-100 transition-colors">
                    <AlertCircle className="h-10 w-10 stroke-[1] text-black" />
                  </div>
                  <p className="text-[18px] font-semibold uppercase tracking-tight">Report issue</p>
                </button>
              </div>
            </div>

            {/* Right column: Send us a message */}
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
              <div className="border-b border-zinc-100 px-8 py-8 bg-[#f9f9f9]/50">
                <h2 className="text-[28px] font-bold tracking-tight">Send us a message</h2>
                <p className="mt-2 text-[14px] text-zinc-500">We'll get back to you within 24–48 business hours.</p>
              </div>

              <form className="space-y-6 px-8 py-8" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.1em] text-zinc-400">
                      Full name <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="E.g. Jane Doe"
                      className="h-[52px] w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-5 text-[14px] outline-none focus:border-black focus:bg-white transition-all shadow-inner placeholder:text-zinc-300"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.1em] text-zinc-400">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="jane@example.com"
                      className="h-[52px] w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-5 text-[14px] outline-none placeholder:text-zinc-300 focus:border-black focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.1em] text-zinc-400">
                    Subject of inquiry <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select defaultValue="" className="h-[52px] w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-5 text-[14px] text-zinc-700 outline-none focus:border-black focus:bg-white transition-all appearance-none shadow-inner">
                      <option value="" disabled>Please select a subject</option>
                      <option>Order Support & Updates</option>
                      <option>Returns & Exchanges</option>
                      <option>Shipping & Delivery Issues</option>
                      <option>General Product Inquiry</option>
                      <option>Bulk Order / Salon Inquiry</option>
                      <option>Feedback & General Questions</option>
                    </select>
                    <ChevronRight className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-zinc-300" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.1em] text-zinc-400">
                    Your message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    placeholder="How can our Royal Support team assist you today? Please provide as much detail as possible, including order numbers if applicable."
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-5 py-4 text-[14px] outline-none focus:border-black focus:bg-white transition-all resize-none shadow-inner placeholder:text-zinc-300"
                  />
                </div>

                <div className="border-t border-zinc-100 pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <button
                        type="button"
                        className="flex h-[52px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 px-6 text-[13px] font-semibold transition hover:bg-zinc-100 hover:border-zinc-500 group"
                      >
                        <Paperclip className="h-4 w-4 text-zinc-400 group-hover:text-black transition-colors" />
                        <span>Attach files</span>
                      </button>
                      <p className="mt-2 text-[11px] text-zinc-400">JPG, PNG, PDF · Max 10 files (10MB each)</p>
                    </div>

                    <button
                      type="submit"
                      className="flex h-[52px] w-full sm:w-auto sm:min-w-[180px] items-center justify-center gap-2 rounded-xl bg-black text-[13px] font-black uppercase tracking-[0.15em] text-white transition hover:bg-zinc-800 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)] active:scale-[0.98]"
                    >
                      <Send className="h-4 w-4" />
                      Submit Ticket
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {/* Location & Map Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* Left: Location details */}
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
              <div className="border-b border-zinc-100 px-8 py-8 bg-[#f9f9f9]/50">
                <h2 className="text-[28px] font-bold tracking-tight">Find Us</h2>
                <p className="mt-1 text-[14px] text-zinc-500">Visit us in Kampala or reach out directly.</p>
              </div>
              <div className="flex flex-col gap-6 px-8 py-8">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-50 border border-zinc-200">
                    <MapPin className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Address</p>
                    <p className="text-[15px] font-medium text-black leading-relaxed">Kampala, Uganda</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-50 border border-zinc-200">
                    <Phone className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Phone</p>
                    <a href="tel:+256793695678" className="text-[15px] font-medium text-black hover:underline">
                      +256 793 695 678
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-50 border border-zinc-200">
                    <Mail className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Email</p>
                    <a href="mailto:info@royalbraids.ug" className="text-[15px] font-medium text-black hover:underline">
                      info@royalbraids.ug
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-50 border border-zinc-200">
                    <Clock className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Business Hours</p>
                    <p className="text-[15px] font-medium text-black">Mon – Sat: 8:00 AM – 7:00 PM</p>
                    <p className="text-[14px] text-zinc-500">Sunday: 10:00 AM – 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Map */}
            <div className="overflow-hidden rounded-xl border border-zinc-200 shadow-lg h-full min-h-[400px]">
              <iframe
                title="Royal Braids Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255282.35853440736!2d32.41968853300781!3d0.3475964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbc0f90b6e32b%3A0x93a98d78c13f5ba!2sKampala%2C%20Uganda!5e0!3m2!1sen!2sug!4v1711641600000!5m2!1sen!2sug"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "400px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
