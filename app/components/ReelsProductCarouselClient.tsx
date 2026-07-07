"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Plus,
  VolumeX,
  Volume2,
} from "lucide-react";

export type ReelItem = {
  id: number;
  video: string;
  poster?: string | null;
  productImage?: string | null;
  title: string;
  price: string;
  link?: string | null;
};

function ReelCard({ 
  item, 
  isActive 
}: { 
  item: ReelItem; 
  isActive: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  return (
    <div 
      className={`shrink-0 transition-all duration-700 ease-out py-8 md:py-20 ${
        isActive ? "z-10 scale-[1.12] md:scale-[1.25]" : "scale-100"
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-[14px] bg-neutral-200 transition-all duration-700 shadow-lg md:shadow-2xl ${
          expanded 
            ? "w-[160px] md:w-[260px] h-[340px] md:h-[560px]" 
            : "w-[160px] md:w-[260px] h-[280px] md:h-[480px]"
        }`}
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={item.video}
          poster={item.poster || undefined}
          muted={muted}
          loop
          playsInline
          preload="none"
        />

        <button
          onClick={toggleMute}
          className="absolute bottom-3 right-3 z-20 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/50"
        >
          {muted ? <VolumeX size={12} className="md:hidden" /> : <Volume2 size={12} className="md:hidden" />}
          {muted ? <VolumeX size={16} className="hidden md:block" /> : <Volume2 size={16} className="hidden md:block" />}
        </button>
      </div>

      <div className={`mt-4 md:mt-8 w-[160px] md:w-[260px] rounded-[4px] border border-neutral-300 bg-white px-2 md:px-3 py-1.5 md:py-2 shadow-sm transition-opacity duration-700 ${isActive ? "opacity-100" : "opacity-0"}`}>
        <div className="flex items-center gap-2 md:gap-3">
          {item.productImage && (
            <div className="h-[40px] w-[40px] md:h-[58px] md:w-[58px] shrink-0 overflow-hidden rounded-[2px] bg-white">
              <img
                src={item.productImage}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-[11px] md:text-[14px] font-semibold leading-[1.15] text-black">
              {item.title}
            </h3>
            <p className="mt-1 text-[10px] md:text-[13px] font-semibold leading-none text-black">
              {item.price}
            </p>
          </div>

          <div className="flex items-center gap-1.5 md:gap-3 pl-1">
            <button className="flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full bg-black text-white transition hover:scale-105">
              <Plus size={12} className="md:hidden" strokeWidth={2.5} />
              <Plus size={16} className="hidden md:block" strokeWidth={2.5} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="flex h-5 w-5 md:h-6 md:w-6 items-center justify-center text-black"
            >
              <ChevronUp
                size={14}
                className={`transition-transform duration-300 md:hidden ${
                  expanded ? "rotate-180" : "rotate-0"
                }`}
              />
              <ChevronUp
                size={18}
                className={`transition-transform duration-300 hidden md:block ${
                  expanded ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReelsProductCarouselClient({ items }: { items: ReelItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Triple the items for infinite scroll effect
  const tripledItems = [...items, ...items, ...items];

  useEffect(() => {
    setIsMounted(true);
    if (items.length > 0) {
      setActiveId(items[0].id);
      setActiveIndex(items.length);
    }

    if (scrollRef.current && items.length > 0) {
      const container = scrollRef.current;
      const isMobile = window.innerWidth < 768;
      const itemWidth = isMobile ? 184 : 320; 
      container.scrollLeft = itemWidth * items.length;
    }
  }, [items]);

  const handleScroll = () => {
    if (!scrollRef.current || items.length === 0) return;
    const container = scrollRef.current;
    const scrollWidth = container.scrollWidth / 3;
    
    if (container.scrollLeft <= 0) {
      container.scrollLeft = scrollWidth;
    } else if (container.scrollLeft >= scrollWidth * 2) {
      container.scrollLeft = scrollWidth;
    }

    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    const children = container.children[0].children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    setActiveIndex(closestIndex);
    if (tripledItems[closestIndex]) {
      setActiveId(tripledItems[closestIndex].id);
    }
  };

  if (!isMounted || items.length === 0) {
    return (
      <section className="w-full bg-white py-12 md:py-24">
        <div className="mx-auto h-[250px] md:h-[400px]" />
      </section>
    );
  }

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2.5; 
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollPrev = () => {
    if (!scrollRef.current) return;
    const isMobile = window.innerWidth < 768;
    const itemWidth = isMobile ? 184 : 320;
    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollLeft - itemWidth,
      behavior: "smooth",
    });
  };

  const scrollNext = () => {
    if (!scrollRef.current) return;
    const isMobile = window.innerWidth < 768;
    const itemWidth = isMobile ? 184 : 320;
    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollLeft + itemWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-white py-8 md:py-24 overflow-hidden">
      <div className="mx-auto relative">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className={`scrollbar-hide overflow-x-auto px-4 md:px-10 cursor-grab active:cursor-grabbing ${isDragging ? "select-none" : ""}`}
        >
          <div className="flex gap-6 md:gap-14 pb-10 pt-10 min-w-max px-[10%] md:px-[35%]">
            {tripledItems.map((item, index) => (
              <Link
                key={`${item.id}-${index}`}
                href={item.link || "/products"}
                className="cursor-default"
              >
                <ReelCard
                  item={item}
                  isActive={activeIndex === index}
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-4 md:mt-12 flex items-center justify-center gap-4 md:gap-6">
          <button
            onClick={scrollPrev}
            className="flex h-9 w-9 md:h-12 md:w-12 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-sm transition-all hover:bg-black hover:text-white"
            aria-label="Previous reel"
          >
            <ChevronLeft size={18} className="md:hidden" />
            <ChevronLeft size={24} className="hidden md:block" />
          </button>
          <button
            onClick={scrollNext}
            className="flex h-9 w-9 md:h-12 md:w-12 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-sm transition-all hover:bg-black hover:text-white"
            aria-label="Next reel"
          >
            <ChevronRight size={18} className="md:hidden" />
            <ChevronRight size={24} className="hidden md:block" />
          </button>
        </div>
      </div>
    </section>
  );
}
