// Client-side image compression. Resizes large images down to a max dimension
// and re-encodes them so uploads stay under a configurable size cap.
// Falls back to the original file if compression isn't possible.

export type CompressOptions = {
  maxBytes?: number; // target upper bound, default 5MB
  maxDimension?: number; // longest edge in pixels, default 2400
  initialQuality?: number; // 0..1, default 0.85
  minQuality?: number; // floor, default 0.5
  mimeType?: string; // output mime, default image/jpeg
};

const DEFAULTS: Required<CompressOptions> = {
  maxBytes: 5 * 1024 * 1024,
  maxDimension: 2400,
  initialQuality: 0.85,
  minQuality: 0.5,
  mimeType: "image/jpeg",
};

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), type, quality),
  );
}

export async function compressImage(
  file: File,
  options: CompressOptions = {},
): Promise<File> {
  if (typeof window === "undefined") return file;
  if (!file.type.startsWith("image/")) return file;
  // GIF / SVG etc — skip, encoding to JPEG would lose animation/vector
  if (/^image\/(gif|svg\+xml|x-icon)/.test(file.type)) return file;

  const opts = { ...DEFAULTS, ...options };
  if (file.size <= opts.maxBytes) return file;

  let img: HTMLImageElement;
  try {
    img = await loadImage(file);
  } catch {
    return file;
  }

  // Compute resized dimensions preserving aspect ratio.
  const longest = Math.max(img.naturalWidth, img.naturalHeight);
  const scale = longest > opts.maxDimension ? opts.maxDimension / longest : 1;
  let width = Math.round(img.naturalWidth * scale);
  let height = Math.round(img.naturalHeight * scale);

  // Iterate: shrink dimensions / quality until size cap is met or floor reached.
  let quality = opts.initialQuality;
  let attempt = 0;
  while (attempt < 8) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await canvasToBlob(canvas, opts.mimeType, quality);
    if (!blob) break;
    if (blob.size <= opts.maxBytes) {
      return new File(
        [blob],
        replaceExtension(file.name, opts.mimeType),
        { type: opts.mimeType, lastModified: Date.now() },
      );
    }
    // Reduce quality first, then dimensions, then quality again.
    if (quality > opts.minQuality + 0.01) {
      quality = Math.max(opts.minQuality, quality - 0.1);
    } else {
      width = Math.round(width * 0.85);
      height = Math.round(height * 0.85);
      quality = Math.max(opts.minQuality, opts.initialQuality - 0.1);
    }
    attempt++;
  }

  // Last-ditch attempt
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, width, height);
  const finalBlob = await canvasToBlob(canvas, opts.mimeType, opts.minQuality);
  if (!finalBlob) return file;
  return new File(
    [finalBlob],
    replaceExtension(file.name, opts.mimeType),
    { type: opts.mimeType, lastModified: Date.now() },
  );
}

function replaceExtension(name: string, mime: string) {
  const ext = mime === "image/png" ? ".png" : mime === "image/webp" ? ".webp" : ".jpg";
  return name.replace(/\.[^.]+$/, "") + ext;
}
