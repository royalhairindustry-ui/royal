import prisma from "@/lib/prisma";

type ProductMatch = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  priceInCents: number;
  stock: number;
  unit: string;
  category: {
    name: string;
    slug: string;
  };
  colors: Array<{
    name: string;
    code: string | null;
  }>;
  unitOptions: Array<{
    label: string;
    priceInCents: number;
    stock: number;
  }>;
  variations: Array<{
    type: string;
    value: string;
  }>;
};

const FALLBACK_PHONE = "+256 781 662 904";
const FALLBACK_EMAIL = "info@royalbraids.ug";
const FALLBACK_BRAND_SUMMARY =
  "Royal Braids Ltd Uganda offers premium braiding hair, weaves, closures, crochet hair, and hair care essentials for customers in Kampala and across Uganda.";

const FAQ_ENTRIES = [
  {
    keywords: ["cancel", "edit order", "change order"],
    answer:
      "Orders can only be cancelled or edited within 1 hour of placement. Once processing has started, changes are no longer available. Share your order number and I can guide you to the next step.",
  },
  {
    keywords: ["shipping claim", "lost package", "damaged", "stolen"],
    answer:
      "If a package is lost, damaged, or stolen, contact Royal Braids within 7 days after the order shows Delivered. Keep the original packaging if the item arrived damaged.",
  },
  {
    keywords: ["return", "exchange", "refund policy", "return policy"],
    answer:
      "Royal Braids accepts returns of unused, unopened products in their original packaging within 14 days of delivery. Opened hair extensions or used tools are generally not returnable for hygiene reasons.",
  },
  {
    keywords: ["recommendation", "recommend", "suggest", "which product", "which braids"],
    answer:
      "I can recommend products if you tell me the style, length, texture, or category you want. For example: braids, closures, crochet braid, weaves, or hair care.",
  },
] as const;

const SIZE_GUIDES = [
  {
    type: "Braids",
    packs: "3-5 packs",
    sizes: ['Shoulder (12")', 'Mid-back (18")', 'Waist (24")', 'Hip (30")'],
  },
  {
    type: "Weaves",
    packs: "2-3 bundles",
    sizes: ['10-12"', '14-16"', '18-20"', '22-24"'],
  },
  {
    type: "Crochet",
    packs: "4-6 packs",
    sizes: ["Regular", "Premium Long"],
  },
] as const;

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function includesAny(value: string, candidates: readonly string[]) {
  return candidates.some((candidate) => value.includes(candidate));
}

function formatPrice(value: number) {
  return `UGX ${value.toLocaleString()}`;
}

function limitText(value: string | null | undefined, max = 180) {
  if (!value) return "";
  const text = value.trim().replace(/\s+/g, " ");
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

function scoreProductMatch(query: string, product: ProductMatch) {
  let score = 0;
  const name = normalizeText(product.name);
  const description = normalizeText(product.description || "");
  const category = normalizeText(product.category.name);
  const colors = product.colors.map((item) => normalizeText(`${item.name} ${item.code || ""}`)).join(" ");
  const variations = product.variations
    .map((item) => normalizeText(`${item.type} ${item.value}`))
    .join(" ");

  if (query.includes(name)) score += 12;
  if (name.includes(query)) score += 10;

  for (const token of query.split(" ")) {
    if (token.length < 3) continue;
    if (name.includes(token)) score += 4;
    if (category.includes(token)) score += 3;
    if (description.includes(token)) score += 2;
    if (colors.includes(token)) score += 2;
    if (variations.includes(token)) score += 2;
  }

  return score;
}

function formatProductSummary(product: ProductMatch) {
  const price =
    product.unitOptions.length > 0
      ? Math.min(...product.unitOptions.map((option) => option.priceInCents))
      : product.priceInCents;
  const stockLabel = product.stock > 0 ? `${product.stock} in stock` : "currently out of stock";
  const colorLabel =
    product.colors.length > 0
      ? ` Colors: ${product.colors.slice(0, 4).map((item) => item.name).join(", ")}.`
      : "";
  const variationLabel =
    product.variations.length > 0
      ? ` Options: ${product.variations
          .slice(0, 4)
          .map((item) => `${item.type} ${item.value}`)
          .join(", ")}.`
      : "";

  return `${product.name} is in ${product.category.name}. From ${formatPrice(price)} per ${product.unit}. ${stockLabel}.${colorLabel}${variationLabel} View: /products/${product.slug}`;
}

async function findRelevantProducts(query: string) {
  const normalizedQuery = normalizeText(query);

  const products = await prisma.product.findMany({
    where: {
      status: "Active",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      priceInCents: true,
      stock: true,
      unit: true,
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      colors: {
        select: {
          name: true,
          code: true,
        },
      },
      unitOptions: {
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          label: true,
          priceInCents: true,
          stock: true,
        },
      },
      variations: {
        select: {
          type: true,
          value: true,
        },
      },
    },
    take: 120,
    orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }],
  });

  return products
    .map((product) => ({
      product,
      score: scoreProductMatch(normalizedQuery, product),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.product);
}

async function findRelevantCategories(query: string) {
  const normalizedQuery = normalizeText(query);
  const categories = await prisma.category.findMany({
    select: {
      name: true,
      slug: true,
      description: true,
    },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    take: 20,
  });

  return categories.filter((category) => {
    const haystack = normalizeText(
      `${category.name} ${category.slug} ${category.description || ""}`,
    );
    return normalizedQuery
      .split(" ")
      .some((token) => token.length >= 3 && haystack.includes(token));
  });
}

async function getStoreContext() {
  const [settings, topbarMessages, navItems] = await Promise.all([
    prisma.siteSettings.findUnique({
      where: { id: 1 },
      select: {
        contactEmail: true,
        contactPhone: true,
      },
    }),
    prisma.topbarMessage.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
      take: 3,
      select: { text: true },
    }),
    prisma.headerNavItem.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
      take: 8,
      select: { name: true, href: true },
    }),
  ]);

  return { settings, topbarMessages, navItems };
}

async function getOrderReply(text: string) {
  const orderNumberMatch = text.match(/\bRB-\d{6}\b/i);

  if (!orderNumberMatch) {
    return "To track an order, send your Royal Braids order number in this format: RB-123456. You can also use /track-order.";
  }

  const orderNumber = orderNumberMatch[0].toUpperCase();
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    return `I couldn't find order ${orderNumber}. Please confirm the number or use /track-order to check again.`;
  }

  const items = order.items.slice(0, 3).map((item) => item.product.name).join(", ");
  const itemText = items ? ` Items: ${items}.` : "";

  return `Order ${order.orderNumber} is currently ${order.status}. Delivery city: ${order.city}.${itemText} If you need an update from support, share the order number on WhatsApp too.`;
}

export async function getChatbotReply(text: string) {
  const normalized = normalizeText(text);
  const { settings, topbarMessages, navItems } = await getStoreContext();
  const phone = settings?.contactPhone || FALLBACK_PHONE;
  const email = settings?.contactEmail || FALLBACK_EMAIL;

  if (!normalized) {
    return "Tell me what you need help with: products, prices, order tracking, returns, delivery, or contact details.";
  }

  if (includesAny(normalized, ["hello", "hi", "hey", "good morning", "good afternoon"])) {
    const navSummary =
      navItems.length > 0
        ? `Popular sections: ${navItems.map((item) => `${item.name} (${item.href})`).join(", ")}.`
        : "";

    return `Welcome to Royal Braids. ${FALLBACK_BRAND_SUMMARY} ${navSummary}`.trim();
  }

  if (includesAny(normalized, ["track", "order status", "where is my order", "rb-"])) {
    return getOrderReply(text);
  }

  if (includesAny(normalized, ["contact", "phone", "email", "call", "whatsapp", "reach"])) {
    return `You can reach Royal Braids on ${phone} or ${email}. Support hours shown on the site are Monday to Friday 9am-6pm and Saturday 9am-4pm. Contact page: /contact`;
  }

  if (includesAny(normalized, ["delivery", "shipping", "kampala", "nationwide"])) {
    const promos = topbarMessages.map((item) => item.text).join(" ");
    const deliveryNote = promos || "Free delivery in Kampala on qualifying orders.";
    return `${deliveryNote} For shipment issues, contact Royal Braids within 7 days if an order shows Delivered but was lost, damaged, or stolen.`;
  }

  if (includesAny(normalized, ["return", "exchange", "refund", "cancel", "damaged", "stolen"])) {
    const faqHit = FAQ_ENTRIES.find((entry) => includesAny(normalized, entry.keywords));
    return faqHit
      ? `${faqHit.answer} Help page: /help`
      : "Returns are accepted for unused, unopened products within 14 days of delivery. Opened hair extensions or used tools are generally not returnable. Help page: /help";
  }

  if (includesAny(normalized, ["size", "length", "packs", "bundles", "bundle"])) {
    const guide =
      SIZE_GUIDES.find((item) => normalized.includes(item.type.toLowerCase())) || SIZE_GUIDES[0];
    return `${guide.type} guide: ${guide.sizes.join(", ")}. Typical quantity: ${guide.packs}. If you tell me the style you want, I can point you to matching products.`;
  }

  if (includesAny(normalized, ["about", "who are you", "royal braids", "what do you sell"])) {
    return `${FALLBACK_BRAND_SUMMARY} Main shopping areas include closures, crochet braid, weaves, braids, and help/contact pages.`;
  }

  const [matchedProducts, matchedCategories] = await Promise.all([
    findRelevantProducts(text),
    findRelevantCategories(text),
  ]);

  if (includesAny(normalized, ["price", "cost", "how much", "available", "stock", "have"])) {
    if (matchedProducts.length > 0) {
      return matchedProducts.map(formatProductSummary).join("\n\n");
    }

    if (matchedCategories.length > 0) {
      const category = matchedCategories[0];
      return `I found the ${category.name} collection. You can browse it here: /products?category=${category.slug}`;
    }
  }

  if (
    includesAny(normalized, [
      "braids",
      "weaves",
      "closure",
      "crochet",
      "hair care",
      "haircare",
      "recommend",
      "style",
      "texture",
      "color",
    ])
  ) {
    if (matchedProducts.length > 0) {
      const intro = includesAny(normalized, ["recommend", "suggest"])
        ? "Here are the closest Royal Braids matches I found:"
        : "Here is what I found in the Royal Braids catalog:";
      return `${intro}\n\n${matchedProducts.map(formatProductSummary).join("\n\n")}`;
    }

    if (matchedCategories.length > 0) {
      return matchedCategories
        .slice(0, 3)
        .map(
          (category) =>
            `${category.name}: ${limitText(category.description, 120) || "Browse this collection on the website."} /products?category=${category.slug}`,
        )
        .join("\n\n");
    }
  }

  if (includesAny(normalized, ["help", "faq", "support"])) {
    return "I can help with order tracking, product recommendations, pricing, delivery, returns, and contact details. You can also visit /help or /contact.";
  }

  if (matchedProducts.length > 0) {
    return matchedProducts.map(formatProductSummary).join("\n\n");
  }

  if (matchedCategories.length > 0) {
    return matchedCategories
      .slice(0, 3)
      .map(
        (category) =>
          `${category.name}: ${limitText(category.description, 120) || "Available in the Royal Braids catalog."} /products?category=${category.slug}`,
      )
      .join("\n\n");
  }

  return `I can help with Royal Braids products, pricing, order tracking, delivery, returns, and contact details. Try asking about a product name, a category like braids or weaves, or send your order number such as RB-123456.`;
}
