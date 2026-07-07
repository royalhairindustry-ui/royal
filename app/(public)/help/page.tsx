"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Truck, 
  RefreshCcw, 
  ShieldCheck,
  Package
} from "lucide-react";

const faqData = [
  {
    category: "Orders & Shipping",
    icon: <Truck className="h-5 w-5" />,
    questions: [
      {
        id: "cancel-order",
        question: "Can I cancel or edit my order?",
        answer: "Orders can only be cancelled or edited within 1 hour of placement. Once an order has been processed by our warehouse, we are unable to make changes. To request a cancellation, please contact our support team immediately with your order number."
      },
      {
        id: "shipping-claim",
        question: "How do I file a claim with Shipping?",
        answer: "If your package is lost, damaged, or stolen, please contact us within 7 days of the 'Delivered' status. We will initiate a claim with our shipping partner. Please keep all original packaging if the item arrived damaged."
      }
    ]
  },
  {
    category: "Returns & Exchanges",
    icon: <RefreshCcw className="h-5 w-5" />,
    questions: [
      {
        id: "start-return",
        question: "How do I start a return?",
        answer: "To start a return, please visit our 'Returns Center' via the link in your shipping confirmation email or log in to your account. You will need your order number and the email address used for the purchase."
      },
      {
        id: "return-policy",
        question: "What is your return policy?",
        answer: "We accept returns of unused, unopened products in their original packaging within 14 days of delivery. For hygiene reasons, certain items like opened hair extensions or used tools cannot be returned. Return shipping costs are usually the responsibility of the customer unless the item is defective."
      }
    ]
  },
  {
    category: "Product Info",
    icon: <ShieldCheck className="h-5 w-5" />,
    questions: [
      {
        id: "recommendations",
        question: "How can I get Product Recommendations?",
        answer: "Our expert stylists are happy to help! You can reach out via our contact form or chat with 'Product Recommendations' as your subject. Tell us about your hair type, desired length, and style, and we'll suggest the best match for you."
      }
    ]
  }
];

export default function HelpFAQPage() {
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleQuestion = (id: string) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Search Hero */}
      <div className="bg-zinc-50 border-b border-zinc-100 py-16 md:py-24">
        <div className="mx-auto max-w-[800px] px-6 text-center">
          <h1 className="text-[40px] md:text-[56px] font-bold tracking-tight mb-6">How can we help?</h1>
          <div className="relative max-w-[600px] mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <input 
              type="text"
              placeholder="Search for articles or questions..."
              className="w-full h-[64px] rounded-full border border-zinc-200 pl-14 pr-6 text-[16px] outline-none focus:border-black transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-[280px_1fr] gap-16">
          {/* Sidebar */}
          <aside className="hidden lg:block space-y-8">
            <div className="sticky top-24">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-6">Categories</h3>
              <nav className="flex flex-col gap-4">
                {faqData.map((cat) => (
                  <button key={cat.category} className="flex items-center gap-3 text-[15px] font-medium text-zinc-600 hover:text-black transition-colors">
                    <span className="opacity-60">{cat.icon}</span>
                    {cat.category}
                  </button>
                ))}
              </nav>

              <div className="mt-12 p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
                <MessageSquare className="h-6 w-6 mb-4 text-black" />
                <h4 className="text-[16px] font-bold mb-2">Still need help?</h4>
                <p className="text-[14px] text-zinc-500 mb-4 leading-relaxed">Our support team is available Mon-Fri 9am-6pm.</p>
                <Link 
                  href="/contact"
                  className="inline-block text-[14px] font-bold underline underline-offset-4 hover:opacity-70 transition-opacity"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </aside>

          {/* FAQ Content */}
          <div className="space-y-16">
            {faqData.map((section) => (
              <section key={section.category}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-10 w-10 rounded-xl bg-black flex items-center justify-center text-white">
                    {section.icon}
                  </div>
                  <h2 className="text-[24px] font-bold uppercase tracking-tight">{section.category}</h2>
                </div>

                <div className="divide-y divide-zinc-100 border-t border-zinc-100">
                  {section.questions.map((item) => (
                    <div key={item.id} className="py-6">
                      <button 
                        onClick={() => toggleQuestion(item.id)}
                        className="flex w-full items-center justify-between text-left group"
                      >
                        <span className={`text-[18px] md:text-[20px] font-medium transition-colors ${activeQuestion === item.id ? "text-black" : "text-zinc-500 group-hover:text-black"}`}>
                          {item.question}
                        </span>
                        {activeQuestion === item.id ? (
                          <ChevronUp className="h-5 w-5 text-black" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-zinc-300 group-hover:text-black" />
                        )}
                      </button>
                      
                      {activeQuestion === item.id && (
                        <div className="mt-4 text-[16px] leading-relaxed text-zinc-600 max-w-[680px] animate-in slide-in-from-top-2 duration-300">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Quick Actions Mobile */}
            <div className="lg:hidden grid gap-4 pt-8">
              <Link 
                href="/track-order"
                className="flex items-center justify-between p-6 rounded-2xl border border-zinc-200 bg-white group hover:border-black transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Package className="h-6 w-6" />
                  <span className="font-bold">Track your order</span>
                </div>
                <ChevronDown className="h-5 w-5 -rotate-90 text-zinc-300" />
              </Link>
              <Link 
                href="/contact"
                className="flex items-center justify-between p-6 rounded-2xl border border-zinc-200 bg-white group hover:border-black transition-colors"
              >
                <div className="flex items-center gap-4">
                  <MessageSquare className="h-6 w-6" />
                  <span className="font-bold">Contact Support</span>
                </div>
                <ChevronDown className="h-5 w-5 -rotate-90 text-zinc-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
