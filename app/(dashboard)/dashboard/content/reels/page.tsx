import React from "react";
import { Film, Trash2 } from "lucide-react";
import { deleteReel } from "@/lib/actions";
import { revalidatePath } from "next/cache";
import ReelsClientWrapper from "@/app/components/ReelsClientWrapper";
import { getProductReels } from "@/lib/reels";

export default async function ProductReelsPage() {
  const reels = await getProductReels();

  return (
    <div className="space-y-6">
      <ReelsClientWrapper />

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {reels.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-zinc-100 bg-white p-16 shadow-sm text-center">
            <div className="mx-auto flex max-w-[420px] flex-col items-center">
              <div className="mb-6 rounded-full bg-zinc-50 p-6">
                <Film className="h-10 w-10 text-zinc-300" />
              </div>
              <h2 className="text-[20px] font-bold text-black">No Reels Found</h2>
              <p className="mt-2 text-[15px] text-zinc-500">
                No product reels have been added yet. Start by adding a video link.
              </p>
            </div>
          </div>
        ) : (
          reels.map((reel) => (
            <div key={reel.id} className="group relative overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition hover:shadow-md">
              <div className="relative aspect-[9/16] w-full overflow-hidden bg-zinc-100">
                <video 
                  src={reel.video} 
                  poster={reel.poster || undefined}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                  <p className="font-bold text-[14px] line-clamp-1">{reel.title}</p>
                  <p className="text-[12px] opacity-90">{reel.price}</p>
                </div>
                
                <form action={async () => {
                  "use server";
                  await deleteReel(reel.id);
                  revalidatePath("/dashboard/content/reels");
                }} className="absolute right-2 top-2 opacity-0 transition group-hover:opacity-100">
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-lg hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
