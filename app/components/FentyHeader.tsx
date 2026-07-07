"use client";

import { Heart, ShoppingBag, User, Search, Menu, X } from "lucide-react";
import AnimatedThemeToggler from "@/components/ui/animated-theme-toggler";
import { useState } from "react";
import { cloudinaryImages } from "@/lib/cloudinary";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import Link from "next/link";

interface HeaderProps {
  navLinks?: { name: string; href: string }[];
  promoMessages?: string[];
  settings?: { logoUrl?: string | null; ugFlagUrl?: string | null } | null;
}

const weavesMegaMenu = {
  image: cloudinaryImages.footerFeature,
  imageAlt: "Royal Braids weaves collection",
  columns: [
    {
      title: "Human Hair",
      links: [
        { label: "Human Hair Weaves", href: "/human-hair-weaves" },
        { label: "Human Hair Blend Weaves", href: "/human-hair-blend-weaves" },
        { label: "Unprocessed Hair Weave Bundles", href: "/unprocessed-hair-weave-bundles" },
        { label: "Remy Hair Weaves", href: "/remy-hair-weaves" },
      ],
    },
    {
      title: "Care & Accessories",
      links: [
        { label: "Weave Care Products", href: "/weave-care-products" },
        { label: "Weave Accessories", href: "/weave-accessories" },
      ],
    },
    {
      title: "Synthetic Hair",
      links: [
        { label: "Synthetic Hair Weaves", href: "/synthetic-hair-weaves" },
        { label: "Organique Weaves", href: "/organique-weaves" },
        { label: "Clip In Weaves", href: "/clip-in-weaves" },
      ],
    },
  ],
} as const;

const closureDropdownLinks = [
  { label: "Crown Closures", href: "/crown-closures" },
  { label: "Lace Part Closures", href: "/lace-part-closures" },
  { label: "4x4 Lace Closures", href: "/4x4-lace-closures" },
  { label: "5x5 Lace Closures", href: "/5x5-lace-closures" },
  { label: "2x6 Lace Closures", href: "/2x6-lace-closures" },
  { label: "13x4 Lace Closures", href: "/13x4-lace-closures" },
  { label: "360 Lace Closures", href: "/360-lace-closures" },
] as const;

export default function FentyHeader({ 
  navLinks = [], 
  promoMessages = [],
  settings
}: HeaderProps) {
  const headerSettings = settings ?? {};
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWeavesMegaMenuOpen, setIsWeavesMegaMenuOpen] = useState(false);
  const [isClosureMenuOpen, setIsClosureMenuOpen] = useState(false);
  const { setIsCartOpen, totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();

  const activePromoMessages = promoMessages.length > 0 ? promoMessages : [
    "Free delivery in Kampala on qualifying orders",
    "New premium braid textures now available",
    "Book bulk orders for salons and resellers",
  ];

  const fallbackNavLinks = [
    { name: "Crochet Braid", href: "/products?category=crochet-braid" },
    { name: "Braids", href: "/products?category=braids" },
    { name: "Curls", href: "/products?category=curls" },
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact Us", href: "/contact" },
    { name: "Help", href: "/help" },
  ];

  const hiddenNavNames = new Set(["weaves", "closure"]);

  const activeNavLinks = (
    navLinks.length > 0 ? navLinks : fallbackNavLinks
  ).filter((item) => !hiddenNavNames.has(item.name.trim().toLowerCase()));

  return (
    <header className="w-full bg-black">
      <div className="w-full bg-white">
        {/* Top promotional black bar */}
        <div className="flex h-8 w-full items-center overflow-hidden bg-black text-white md:h-12">
          <div className="marquee-track">
            {[0, 1].map((copyIndex) => (
              <div key={copyIndex} className="marquee-group">
                {activePromoMessages.map((message, mIdx) => (
                  <span
                    key={`${copyIndex}-${mIdx}`}
                    className="flex items-center gap-4 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.18em] md:text-xs md:tracking-[0.22em]"
                  >
                    <span className="text-white/55">*</span>
                    {message}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Main top row */}
        <div className="flex h-[56px] items-center justify-between border-b border-zinc-200 px-4 md:h-[82px] md:px-12 lg:px-20">
          {/* Left: Mobile Menu & Country */}
          <div className="flex min-w-[60px] items-center gap-3 text-[12px] text-black md:min-w-[180px] md:text-sm">
            <button
              className="hover:opacity-70 lg:hidden"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-[18px] w-[18px] stroke-[1.5] md:h-5 md:w-5" />
            </button>
            <div className="hidden items-center gap-2 md:flex">
              <img
                src={headerSettings.ugFlagUrl || cloudinaryImages.ugFlag}
                alt="UG Flag"
                className="h-3 w-4.5 overflow-hidden rounded-[1px] object-cover"
              />
              <span className="font-medium">UG</span>
              <span className="hidden text-zinc-400 md:inline">|</span>
              <span className="hidden font-medium md:inline">English</span>
            </div>
          </div>

          {/* Center logo */}
          <div className="flex flex-1 justify-center py-1">
            <Link href="/" className="group flex items-center gap-2 md:gap-4">
              {headerSettings.logoUrl && (
                <img
                  src={headerSettings.logoUrl}
                  alt="Royal Braids Logo"
                  className="h-8 w-auto object-contain transition-transform group-hover:scale-105 md:h-14"
                />
              )}
              <span className="select-none whitespace-nowrap text-[11px] font-semibold font-sans uppercase tracking-[0.18em] text-black md:text-[22px] md:tracking-[0.4em]">
                ROYAL BRAIDS LTD
              </span>
            </Link>
          </div>

          {/* Right icons */}
          <div className="flex min-w-[60px] items-center justify-end gap-2 text-sm text-black md:min-w-[180px] md:gap-4">
            <AnimatedThemeToggler />
            <Link href="/signin" className="flex items-center gap-1 transition-colors hover:opacity-70 text-black">
              <User className="h-[17px] w-[17px] stroke-[1.6] md:h-4 md:w-4" />
              <span className="hidden md:inline">Sign In</span>
            </Link>

            <button className="hover:opacity-70" aria-label="Search">
              <Search className="h-[17px] w-[17px] stroke-[1.6] md:h-4 md:w-4" />
            </button>

            <Link
              href="/wishlist"
              className="group relative flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-zinc-50 md:h-10 md:w-10"
              aria-label="Wishlist"
            >
              <Heart className="h-[17px] w-[17px] stroke-[1.6] text-black md:h-4 md:w-4" />
              {totalWishlistItems > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-black px-[3px] text-[9px] font-black leading-none text-white ring-2 ring-white transition-all group-hover:scale-110 md:right-1 md:top-1 md:h-[18px] md:min-w-[18px] md:text-[10px]">
                  {totalWishlistItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="group relative flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-zinc-50 md:h-10 md:w-10"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="h-[18px] w-[18px] stroke-[1.6] text-black md:h-5 md:w-5" />
              {totalItems > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-black px-[3px] text-[9px] font-black leading-none text-white ring-2 ring-white transition-all group-hover:scale-110 md:right-1 md:top-1 md:h-[18px] md:min-w-[18px] md:text-[10px]">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="relative hidden items-center justify-center gap-10 border-b border-zinc-100 py-4 text-[17px] font-light font-sans text-black lg:flex uppercase tracking-widest">
          {activeNavLinks.map((item, idx) => {
            const isWeavesLink = item.name.toLowerCase() === "weaves";
            const isClosureLink =
              item.name.toLowerCase() === "closure" ||
              item.name.toLowerCase() === "closures";

            if (isClosureLink) {
              return (
                <div
                  key={`${item.name}-${idx}`}
                  className="relative"
                  onMouseEnter={() => setIsClosureMenuOpen(true)}
                  onMouseLeave={() => setIsClosureMenuOpen(false)}
                >
                  <Link
                    href={item.href}
                    className="transition hover:opacity-70 text-black decoration-zinc-200 underline-offset-8 hover:underline"
                  >
                    {item.name}
                  </Link>

                  {isClosureMenuOpen ? (
                    <div className="absolute left-1/2 top-full z-50 min-w-[320px] -translate-x-1/2 pt-4">
                      <div className="bg-[#efefef] px-8 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
                        <ul className="space-y-4">
                          {closureDropdownLinks.map((link) => (
                            <li key={link.label}>
                              <Link
                                href={link.href}
                                className="text-[13px] uppercase tracking-[0.16em] text-[#444] transition hover:text-black"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            }

            if (!isWeavesLink) {
              return (
                <Link
                  key={`${item.name}-${idx}`}
                  href={item.href}
                  className="transition hover:opacity-70 text-black decoration-zinc-200 underline-offset-8 hover:underline"
                >
                  {item.name}
                </Link>
              );
            }

            return (
              <div
                key={`${item.name}-${idx}`}
                className="relative"
                onMouseEnter={() => setIsWeavesMegaMenuOpen(true)}
                onMouseLeave={() => setIsWeavesMegaMenuOpen(false)}
              >
                <Link
                  href={item.href}
                  className="transition hover:opacity-70 text-black decoration-zinc-200 underline-offset-8 hover:underline"
                >
                  {item.name}
                </Link>

                {isWeavesMegaMenuOpen ? (
                  <div className="absolute left-1/2 top-full z-50 w-[min(1292px,calc(100vw-64px))] -translate-x-1/2 pt-4">
                    <div className="w-full bg-[#efefef] px-10 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.12)] xl:px-14">
                      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] items-start gap-10">
                        {weavesMegaMenu.columns.map((column) => (
                          <div key={column.title}>
                            <h3 className="mb-4 text-[18px] font-bold uppercase tracking-normal text-[#333]">
                              {column.title}
                            </h3>
                            <ul className="space-y-4">
                              {column.links.map((link) => (
                                <li key={link.label}>
                                  <Link
                                    href={link.href}
                                    className="text-[13px] uppercase tracking-[0.16em] text-[#444] transition hover:text-black"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}

                        <div className="flex justify-end">
                          <img
                            src={weavesMegaMenu.image}
                            alt={weavesMegaMenu.imageAlt}
                            className="h-auto w-[360px] min-w-[280px] object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[100] transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
        <div className="relative flex h-full w-[75%] max-w-[280px] flex-col bg-white p-6">
          <div className="mb-7 flex items-center justify-between">
            <h2 className="text-[14px] font-semibold font-sans uppercase tracking-widest text-black">Menu</h2>
            <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
              <X className="h-5 w-5 stroke-[1.5] text-black" />
            </button>
          </div>
          <nav className="flex flex-col gap-4 text-[14px] font-light font-sans text-black uppercase tracking-widest">
            {activeNavLinks.map((item, idx) => (
              <Link
                key={`${item.name}-${idx}-mobile`}
                href={item.href}
                className="transition hover:opacity-60"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/wishlist" className="transition hover:opacity-60" onClick={() => setIsMenuOpen(false)}>
              Wishlist
            </Link>
            <Link href="/cart" className="transition hover:opacity-60" onClick={() => setIsMenuOpen(false)}>
              Cart
            </Link>
          </nav>
          <div className="mt-auto border-t border-zinc-100 pt-6 text-[12px] italic text-zinc-500">
            Experience the Royal touch.
          </div>
        </div>
      </div>
    </header>
  );
}
