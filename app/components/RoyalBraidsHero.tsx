import React from 'react';
import Link from 'next/link';

interface CategoryBannerProps {
  category?: {
    name: string;
    description?: string;
    banner?: string;
    circleColor?: string | null;
    backgroundColor?: string | null;
  };
}

export default function RoyalBraidsHero({ category }: CategoryBannerProps) {
  const title = category?.name || "Royal Braids";
  const description = category?.description || "The hairstyle must exactly match the product: rich vibrant purple color, soft wavy texture, smooth silky synthetic fibers, with defined curls toward the ends, full volume";
  const image = category?.banner || "https://res.cloudinary.com/dnvm4kuel/image/upload/v1741718000/braids-model.png";
  const circleColor = category?.circleColor || "#4f43a5";
  const backgroundColor = category?.backgroundColor || "#e9e9e9";

  return (
    <section
      className="w-full border-y py-8 lg:py-0"
      style={{
        backgroundColor,
        borderColor: circleColor,
      }}
    >
      <div className="mx-auto flex min-h-[374px] max-w-[1366px] items-center justify-between overflow-hidden px-4 sm:px-8 xl:px-12">
        <div className="flex w-full flex-col items-center justify-between lg:flex-row">
          {/* Left Side */}
          <div className="flex w-full items-center justify-center lg:w-[55%] lg:justify-start">
            <div
              className="relative flex min-h-[350px] w-full max-w-[420px] flex-col justify-center rounded-3xl px-10 py-12 text-white shadow-2xl md:max-w-[450px] md:px-16 lg:h-[450px] lg:w-[450px] lg:rounded-full lg:px-16"
              style={{ backgroundColor: circleColor }}
            >
              <h1 className="mb-4 text-[32px] font-light leading-tight md:text-[48px] lg:leading-none">
                {title}
              </h1>

              <p className="max-w-[280px] text-[13px] leading-relaxed text-zinc-100 opacity-90 md:text-[14px] md:leading-[1.25]">
                {description}
              </p>

              <Link 
                href="/products"
                className="mt-8 inline-flex w-[165px] items-center justify-center bg-white py-3 text-[18px] font-normal text-black shadow-lg transition-transform hover:scale-105 active:scale-95 md:mt-10 md:text-[22px]"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="mt-12 flex w-full items-center justify-center lg:mt-0 lg:w-[45%] lg:justify-end">
            <img
              src={image} 
              alt={`${title} model`}
              className="max-h-[350px] w-auto object-contain drop-shadow-2xl filter md:max-h-[370px] lg:max-h-[500px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
