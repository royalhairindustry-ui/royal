import React from "react";
import Link from "next/link";
import { 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Globe, 
  Award,
  ChevronRight
} from "lucide-react";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Royal Braids | Premium Hair Extensions Uganda",
  description: "Learn more about Royal Braids Ltd Uganda, your premier destination for high-quality braiding hair, weaves, closures, and professional hair care in Kampala.",
  path: "/about",
});

export default function AboutPage() {
  const values = [
    {
      icon: <ShieldCheck className="h-8 w-8 text-black" />,
      title: "Quality Guaranteed",
      description: "We source only the finest hair fibers and materials to ensure durability and a natural look."
    },
    {
      icon: <Heart className="h-8 w-8 text-black" />,
      title: "Customer First",
      description: "Our community is at the heart of everything we do. Your satisfaction is our top priority."
    },
    {
      icon: <Sparkles className="h-8 w-8 text-black" />,
      title: "Innovation",
      description: "Continuously bringing the latest hair trends and textures to the Ugandan market."
    },
    {
      icon: <Globe className="h-8 w-8 text-black" />,
      title: "Nationwide Reach",
      description: "Delivering beauty across Uganda, from Kampala to every corner of the country."
    }
  ];

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full overflow-hidden bg-black text-white flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1610438235354-a6fa5528385c?q=80&w=2000&auto=format&fit=crop" 
            alt="About Royal Braids" 
            className="h-full w-full object-cover"
          />
        </div>
        
        <div className="relative z-20 mx-auto max-w-[1320px] px-6 md:px-12">
          <div className="max-w-[800px]">
            <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-white/60 mb-6 block">Our Legacy</span>
            <h1 className="text-[48px] md:text-[72px] font-black uppercase tracking-tight leading-[0.9] mb-8">
              Elevating African <br /> Beauty Excellence.
            </h1>
            <p className="text-[18px] md:text-[22px] font-light text-white/80 leading-relaxed max-w-[600px]">
              Royal Braids Ltd is Uganda's premier destination for high-end hair collections, designed for the modern woman who demands quality without compromise.
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb - Overlapping slightly */}
      <div className="mx-auto max-w-[1320px] px-6 md:px-12 -mt-8 relative z-30">
        <div className="bg-white px-6 py-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400 shadow-xl rounded-sm">
          <Link href="/" className="hover:text-black transition">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-black">About Us</span>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-24 px-6 md:px-12 mx-auto max-w-[1320px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-[34px] md:text-[42px] font-black uppercase tracking-tight text-black mb-8 leading-tight">
              Crafting Confidence <br /> Since the Beginning
            </h2>
            <div className="space-y-6 text-[17px] text-zinc-600 leading-relaxed">
              <p>
                Founded in the heart of Kampala, Royal Braids Ltd began with a simple mission: to provide Ugandan women with access to world-class hair extensions that celebrate natural beauty and professional excellence.
              </p>
              <p>
                What started as a specialized collection of braiding hair has grown into a comprehensive beauty house, offering everything from premium weaves and closures to professional-grade hair care essentials.
              </p>
              <p>
                Today, we stand as a symbol of quality in the Ugandan hair industry, trusted by thousands of professional stylists and individual customers alike.
              </p>
            </div>
            
            <div className="mt-12 flex flex-wrap gap-8">
              <div className="flex flex-col">
                <span className="text-[32px] font-black text-black">10k+</span>
                <span className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">Happy Clients</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[32px] font-black text-black">500+</span>
                <span className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">Products</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[32px] font-black text-black">Kampala</span>
                <span className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">HQ Location</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              <div className="aspect-[3/4] overflow-hidden rounded-[2px] bg-zinc-100">
                <img src="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=800&auto=format&fit=crop" alt="Braid Style" className="h-full w-full object-cover" />
              </div>
              <div className="aspect-square overflow-hidden rounded-[2px] bg-zinc-100">
                <img src="https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?q=80&w=800&auto=format&fit=crop" alt="Hair Care" className="h-full w-full object-cover" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-[2px] bg-zinc-100">
                <img src="https://images.unsplash.com/photo-1594433034845-844299d47d6f?q=80&w=800&auto=format&fit=crop" alt="Closures" className="h-full w-full object-cover" />
              </div>
              <div className="aspect-[3/4] overflow-hidden rounded-[2px] bg-zinc-100">
                <img src="https://images.unsplash.com/photo-1620331311520-246422ff82f9?q=80&w=800&auto=format&fit=crop" alt="Salon" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-zinc-50 py-24">
        <div className="mx-auto max-w-[1320px] px-6 md:px-12">
          <div className="mb-16 text-center">
            <h2 className="text-[34px] md:text-[42px] font-black uppercase tracking-tight text-black mb-4">Our Core Values</h2>
            <div className="mx-auto h-1 w-20 bg-black" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-white p-10 rounded-[2px] border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-6">{v.icon}</div>
                <h3 className="text-[20px] font-bold uppercase tracking-tight mb-4">{v.title}</h3>
                <p className="text-[15px] text-zinc-500 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 overflow-hidden">
        <div className="mx-auto max-w-[1320px] px-6 md:px-12">
          <div className="relative">
            {/* Background Text */}
            <div className="absolute -top-20 -left-10 text-[180px] font-black text-zinc-100 select-none opacity-50 z-0 pointer-events-none hidden lg:block">
              MISSION
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center max-w-[900px] mx-auto">
              <Users className="h-10 w-10 mb-8 text-black" />
              <h2 className="text-[34px] md:text-[48px] font-black uppercase tracking-tight text-black mb-8 leading-tight">
                Empowering your style through <br /> unmatched quality control
              </h2>
              <p className="text-[20px] md:text-[24px] text-zinc-600 font-light leading-relaxed italic">
                "Our mission is to establish Royal Braids as the gold standard for hair extensions in East Africa, by providing products that empower women to express their unique beauty with confidence and grace."
              </p>
              <div className="mt-12 pt-12 border-t border-zinc-100 w-full flex flex-col items-center">
                <span className="text-[14px] font-bold uppercase tracking-widest text-black">The Royal Braids Management Team</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black py-20 px-6">
        <div className="mx-auto max-w-[800px] text-center">
          <h2 className="text-[32px] md:text-[42px] font-black uppercase tracking-tight text-white mb-6">Ready to find your look?</h2>
          <p className="text-white/60 mb-10 text-[17px]">Browse our latest collections and find the perfect match for your style.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products" 
              className="px-10 py-5 bg-white text-black text-[13px] font-black uppercase tracking-widest hover:bg-zinc-200 transition"
            >
              Shop Collections
            </Link>
            <Link 
              href="/contact" 
              className="px-10 py-5 bg-transparent border border-white/30 text-white text-[13px] font-black uppercase tracking-widest hover:bg-white/10 transition"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
