import ReelsProductCarouselClient, { ReelItem } from "./ReelsProductCarouselClient";
import { unstable_noStore as noStore } from "next/cache";
import { getProductReels } from "@/lib/reels";

async function getReels(): Promise<ReelItem[]> {
  noStore();
  const reels = await getProductReels();

  return reels.map(r => ({
    id: r.id,
    video: r.video,
    poster: r.poster,
    productImage: r.productImage,
    title: r.title,
    price: r.price,
    link: r.link
  }));
}

export default async function ReelsProductCarousel() {
  const items = await getReels();

  if (items.length === 0) {
    return null;
  }

  return <ReelsProductCarouselClient items={items} />;
}
