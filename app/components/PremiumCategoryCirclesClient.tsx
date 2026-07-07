"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Category = {
  id: number;
  name: string;
  slug: string;
  circleImage: string;
  accent?: string;
};

type PremiumCategoryCirclesClientProps = {
  categories: Category[];
};

export default function PremiumCategoryCirclesClient({
  categories,
}: PremiumCategoryCirclesClientProps) {
  // Default accents if not provided by DB
  const defaultAccents = ["#b565c0", "#aa5ab3", "#9f53aa", "#a85ab4"];

  return (
    <section className="relative overflow-hidden bg-black py-20 md:py-24 xl:py-28">
      {/* soft background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-12 h-52 w-52 rounded-full bg-fuchsia-700/10 blur-3xl" />
        <div className="absolute right-[8%] top-24 h-72 w-72 rounded-full bg-violet-700/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-60 w-[28rem] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1700px] px-6 md:px-10 xl:px-14">
        <div className="mb-12 flex items-center justify-between gap-6 md:mb-16">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-white/45">
              Shop by style
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white md:text-5xl xl:text-6xl">
              Explore Categories
            </h2>
          </div>

          <div className="hidden h-px flex-1 bg-white/10 lg:block" />
        </div>

        <div className="grid grid-cols-1 gap-14 sm:grid-cols-2 xl:grid-cols-4 xl:gap-10">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <Link
                href={`/products?category=${category.slug}`}
                className="group block"
                aria-label={category.name}
              >
                <div className="relative mx-auto flex w-full max-w-[420px] flex-col items-center">
                  {/* glow */}
                  <div
                    className="absolute inset-x-10 top-10 h-[75%] rounded-full opacity-0 blur-3xl transition duration-500 group-hover:opacity-50"
                    style={{
                      backgroundColor:
                        category.accent ||
                        defaultAccents[index % defaultAccents.length],
                    }}
                  />

                  {/* circle frame */}
                  <div className="relative flex h-[320px] w-[320px] items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#9c53a4] shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition duration-500 group-hover:scale-[1.04] group-hover:shadow-[0_28px_90px_rgba(181,101,192,0.28)] md:h-[380px] md:w-[380px] xl:h-[400px] xl:w-[400px]">
                    {/* subtle top sheen */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.14),transparent_42%)]" />

                    {/* edge ring */}
                    <div className="pointer-events-none absolute inset-[10px] rounded-full border border-white/8" />

                    {/* image */}
                    <motion.img
                      src={category.circleImage}
                      alt={category.name}
                      className="relative z-10 h-full w-full scale-110 object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.42)] transition duration-500 group-hover:scale-[1.16]"
                      whileHover={{ y: -6 }}
                      transition={{ type: "spring", stiffness: 140, damping: 14 }}
                    />

                    {/* bottom fade for premium blend */}
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* content */}
                  <div className="mt-7 text-center">
                    <h3 className="text-2xl font-bold tracking-[-0.03em] text-white md:text-[30px]">
                      {category.name}
                    </h3>

                    <div className="mx-auto mt-3 h-px w-16 bg-white/15 transition duration-500 group-hover:w-24 group-hover:bg-fuchsia-400/70" />

                    <p className="mt-4 text-sm font-medium uppercase tracking-[0.28em] text-white/45">
                      View Collection
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
