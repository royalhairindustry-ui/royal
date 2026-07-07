import {
  ArrowRight,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { cloudinaryImages } from "@/lib/cloudinary";

export default function RoyalBridalsFooter() {
  return (
    <footer className="w-full bg-black text-white font-sans">
      <div className="grid min-h-[300px] grid-cols-2 lg:min-h-[460px] lg:grid-cols-[1.1fr_0.65fr_0.9fr_0.55fr]">
        {/* Left newsletter panel */}
        <div className="col-span-2 flex flex-col justify-between bg-gradient-to-r from-[#1a1a1d] to-[#242427] px-6 py-6 md:px-10 lg:col-span-1 lg:px-10 lg:py-10">
          <div className="max-w-[460px]">
            <h2 className="text-[16px] font-bold uppercase leading-tight md:text-[20px]">
              Stay Posted + Unlock Exclusive Offers
            </h2>

            <p className="mt-3 text-[12px] leading-6 text-white/90 md:text-[14px]">
              Keep up with all things Royal Braids Ltd Uganda + save on your next
              order.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex h-11 items-center justify-between rounded-md border border-white/25 px-4 text-sm text-white/80">
                <span>Phone</span>
                <ArrowRight className="h-4 w-4" />
              </div>

              <div className="flex h-11 items-center justify-between rounded-md border border-white/25 px-4 text-sm text-white/80">
                <span>Email</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            <p className="mt-5 max-w-[500px] text-[10px] leading-5 text-white/80 md:text-[11px]">
              By subscribing to Royal Braids Ltd Uganda, you agree to our Terms of
              Use and acknowledge our Privacy Policy and consent to receive a
              varying number of marketing messages via email and text. Consent
              is not a condition of any purchase.
            </p>
          </div>

          <div className="mt-10 md:mt-16">
            <h3 className="text-[18px] font-medium uppercase tracking-[0.3em] text-white md:text-[30px] md:tracking-[0.55em]">
              Royal Braids Ltd 
            </h3>
          </div>
        </div>

        {/* Customer service */}
        <div className="px-6 py-6 md:px-10 lg:py-10">
          <h3 className="text-[16px] font-bold uppercase md:text-[18px]">Customer Service</h3>

          <p className="mt-4 max-w-[290px] text-[12px] leading-6 text-white/90 md:text-[14px]">
            Operating hours are from 9am-6pm Monday-Friday and 9am-4pm
            Saturday. Reach out today!
          </p>

          <p className="mt-3 text-[12px] text-white md:text-[14px]">info@royalbraids.ug</p>
          <p className="mt-3 text-[12px] text-white md:text-[14px]">+256 793695678 / +256 730 247 868</p>

          <div className="mt-6 space-y-3 text-[13px] md:space-y-4 md:text-[15px]">
            <Link href="/track-order" className="block hover:text-white/70">
              Order Status
            </Link>
            <a href="#" className="block hover:text-white/70">
              Shipping Information
            </a>
            <a href="#" className="block hover:text-white/70">
              Returns
            </a>
            <Link href="/contact" className="block hover:text-white/70">
              Contact Us
            </Link>
            <Link href="/help" className="block hover:text-white/70">
              Help & FAQs
            </Link>
            <Link href="/blog" className="block hover:text-white/70">
              Blog
            </Link>
            <a href="#" className="block hover:text-white/70">
              My Account
            </a>
            <a href="#" className="block hover:text-white/70">
              Gift Card Balance
            </a>
          </div>

          <div className="mt-12 flex items-center gap-4">
            <a href="#" aria-label="Instagram" className="hover:text-white/70">
              <Instagram className="h-6 w-6" />
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-white/70">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-white/70">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-white/70">
              <Youtube className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* About */}
        <div className="px-6 py-6 md:px-10 lg:py-10">
          <h3 className="text-[16px] font-bold uppercase md:text-[18px]">About</h3>

          <p className="mt-4 max-w-[420px] text-[12px] leading-6 text-white/90 md:text-[14px]">
            Royal Braids Ltd Uganda offers premium braiding hair, weaves,
            closures, crochet hair, and hair care essentials for customers in
            Kampala and across Uganda.
          </p>

          <div className="mt-6 space-y-3 text-[13px] md:space-y-4 md:text-[15px]">
            <a href="#" className="block hover:text-white/70">
              About the Brand
            </a>
            <a href="#" className="block hover:text-white/70">
              Hair Collections
            </a>
            <a href="#" className="block hover:text-white/70">
              Student Discounts
            </a>
            <a href="#" className="block hover:text-white/70">
              Careers
            </a>
          </div>
        </div>

        {/* Image */}
        <div className="col-span-2 flex items-start justify-center px-6 py-6 md:px-10 lg:col-span-1 lg:justify-end lg:py-10">
          <img
            src={cloudinaryImages.footerFeature}
            alt="Royal Braids Ltd Uganda"
            className="h-auto max-h-[180px] w-full max-w-[180px] object-contain md:max-h-[300px] md:max-w-[300px]"
          />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-8 py-5 md:px-10">
        <div className="flex flex-col gap-4 text-[13px] text-white/90 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span>🇺🇬 Uganda</span>
            <span>|</span>
            <span>English</span>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-white/80">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms of Use
            </a>
            <a href="#" className="hover:text-white">
              Refund Policy
            </a>
            <a href="#" className="hover:text-white">
              Accessibility
            </a>
            <a href="#" className="hover:text-white">
              Do Not Sell or Share My Personal Information
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
