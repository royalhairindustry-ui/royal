import type { Metadata } from "next";

const FALLBACK_SITE_URL = "http://localhost:3000";
const DEFAULT_SITE_NAME = "Royal Braids Ltd";
const DEFAULT_DESCRIPTION =
  "Shop premium hair extensions in Uganda including braids, weaves, closures, crochet hair, and hair care essentials from Royal Braids Ltd in Kampala.";

function normalizeUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function getSiteUrl() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    FALLBACK_SITE_URL;

  if (siteUrl.startsWith("http://") || siteUrl.startsWith("https://")) {
    return normalizeUrl(siteUrl);
  }

  return normalizeUrl(`https://${siteUrl}`);
}

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export function sanitizeDescription(
  value: string | null | undefined,
  fallback = DEFAULT_DESCRIPTION,
) {
  const cleaned = value?.replace(/\s+/g, " ").trim();

  if (!cleaned) return fallback;
  if (cleaned.length <= 160) return cleaned;

  return `${cleaned.slice(0, 157).trimEnd()}...`;
}

type BuildMetadataInput = {
  title: string;
  description?: string | null;
  path?: string;
  image?: string | null;
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const resolvedDescription = sanitizeDescription(description);
  const canonical = absoluteUrl(path);

  return {
    title,
    description: resolvedDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: resolvedDescription,
      url: canonical,
      siteName: DEFAULT_SITE_NAME,
      type: "website",
      images: image
        ? [
            {
              url: image,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description: resolvedDescription,
      images: image ? [image] : undefined,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export const seoDefaults = {
  siteName: DEFAULT_SITE_NAME,
  description: DEFAULT_DESCRIPTION,
};
