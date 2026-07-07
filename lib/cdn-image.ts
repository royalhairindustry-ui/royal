// Injects Cloudinary delivery transformations (auto format/quality + width cap)
// so cards ship ~30-80KB WebP/AVIF thumbnails instead of full-size uploads.
export function cdnImage(url: string | null | undefined, width = 480) {
  if (!url) return url ?? undefined;

  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  // Skip URLs that already carry a transformation segment
  if (/\/upload\/[^/]*(?:f_auto|q_auto|w_\d)/.test(url)) {
    return url;
  }

  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}
