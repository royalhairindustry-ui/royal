"use server";

import prisma from "./prisma";
import { revalidatePath } from "next/cache";
import crypto from 'node:crypto';

function normalizeProductUnitOptions(
  rawUnitOptions: Array<{
    label?: string;
    unit?: string;
    price?: number | string;
    priceInCents?: number | string;
    compareAtPrice?: number | string;
    compareAtPriceInCents?: number | string;
    stock?: number | string;
  }> | undefined,
  fallback?: {
    price?: number | string;
    stock?: number | string;
    unit?: string;
  }
) {
  const normalized = (rawUnitOptions ?? [])
    .map((option, index) => {
      const label = String(option.label ?? option.unit ?? "").trim();
      const unit = String(option.unit ?? option.label ?? "").trim() || label;
      const rawPrice = option.priceInCents ?? option.price ?? 0;
      const rawStock = option.stock ?? 0;
      const priceInCents = Number(rawPrice);
      const stock = Number(rawStock);

      if (!label || !unit || Number.isNaN(priceInCents) || Number.isNaN(stock)) {
        return null;
      }

      const roundedPrice = Math.max(0, Math.round(priceInCents));
      const rawCompareAt = option.compareAtPriceInCents ?? option.compareAtPrice;
      const compareAt =
        rawCompareAt === undefined || rawCompareAt === null || rawCompareAt === ""
          ? null
          : Number(rawCompareAt);
      // Only keep a compare-at price when it is a real discount anchor above the selling price
      const compareAtPriceInCents =
        compareAt !== null && !Number.isNaN(compareAt) && Math.round(compareAt) > roundedPrice
          ? Math.round(compareAt)
          : null;

      return {
        label,
        unit,
        priceInCents: roundedPrice,
        compareAtPriceInCents,
        stock: Math.max(0, Math.round(stock)),
        sortOrder: index,
      };
    })
    .filter(Boolean) as Array<{
      label: string;
      unit: string;
      priceInCents: number;
      compareAtPriceInCents: number | null;
      stock: number;
      sortOrder: number;
    }>;

  if (normalized.length > 0) {
    return normalized;
  }

  const fallbackUnit = String(fallback?.unit ?? "Piece").trim() || "Piece";
  const fallbackPrice = Number(fallback?.price ?? 0);
  const fallbackStock = Number(fallback?.stock ?? 0);

  return [
    {
      label: fallbackUnit,
      unit: fallbackUnit,
      priceInCents: Number.isNaN(fallbackPrice) ? 0 : Math.max(0, Math.round(fallbackPrice)),
      compareAtPriceInCents: null,
      stock: Number.isNaN(fallbackStock) ? 0 : Math.max(0, Math.round(fallbackStock)),
      sortOrder: 0,
    },
  ];
}

async function resolveParentCategoryId(rawParentId: FormDataEntryValue | null) {
  if (!rawParentId) {
    return null;
  }

  const value = String(rawParentId).trim();
  if (!value) {
    return null;
  }

  const parentId = Number(value);
  if (Number.isNaN(parentId)) {
    throw new Error("Invalid parent category.");
  }

  const parentCategory = await prisma.category.findUnique({
    where: { id: parentId },
    select: { id: true },
  });

  if (!parentCategory) {
    throw new Error("Selected parent category was not found.");
  }

  return parentId;
}

async function ensureValidCategoryParent(categoryId: number, parentId: number | null) {
  if (parentId === null) {
    return;
  }

  if (categoryId === parentId) {
    throw new Error("A category cannot be its own parent.");
  }

  let currentParentId: number | null = parentId;

  while (currentParentId !== null) {
    if (currentParentId === categoryId) {
      throw new Error("A category cannot be assigned under one of its own subcategories.");
    }

    const currentParent: { parentId: number | null } | null =
      await prisma.category.findUnique({
      where: { id: currentParentId },
      select: { parentId: true },
      });

    currentParentId = currentParent?.parentId ?? null;
  }
}

export async function getFeaturedProducts(limit = 8) {
  try {
    return await prisma.product.findMany({
      where: {
        isFeatured: true,
        status: { not: "Archived" },
      } as any,
      include: {
        category: {
          select: { name: true },
        },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

export async function createProduct(formData: any) {
  try {
    const { name, description, price, stock, category, unit, unitOptions, colors, variations, status, isFeatured, image, hoverImage } = formData;

    // Basic slug generation
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Ensure category exists or connect
    const categoryRecord = await prisma.category.upsert({
      where: { slug: category.toLowerCase().replace(/ /g, "-") },
      update: {},
      create: {
        name: category,
        slug: category.toLowerCase().replace(/ /g, "-"),
      },
    });

    // Handle colors - ensure they exist
    const colorConnections = await Promise.all(
      colors.map(async (c: { name: string; hex: string; code?: string }) => {
        return await prisma.color.upsert({
          where: { hex: c.hex },
          update: {
            name: c.name,
            code: c.code || null,
          },
          create: {
            name: c.name,
            hex: c.hex,
            code: c.code || null,
          },
        });
      })
    );

    // Check for slug uniqueness before creating
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return { success: false, error: `A product with the name "${name}" already exists. Please choose a different name.` };
    }

    const normalizedUnitOptions = normalizeProductUnitOptions(unitOptions, {
      price,
      stock,
      unit,
    });
    const primaryUnitOption = normalizedUnitOptions[0];

    // Create the product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        priceInCents: primaryUnitOption.priceInCents,
        compareAtPriceInCents: primaryUnitOption.compareAtPriceInCents,
        stock: primaryUnitOption.stock,
        unit: primaryUnitOption.label,
        status: status || "Active",
        isFeatured: Boolean(isFeatured),
        image,
        hoverImage,
        categoryId: categoryRecord.id,
        colors: {
          connect: colorConnections.map((c) => ({ id: c.id })),
        },
        unitOptions: {
          create: normalizedUnitOptions,
        },
        variations: {
          create: variations.map((v: { name: string; value: string }) => ({
            type: v.name,
            value: v.value,
          })),
        },
      },
    });

    revalidatePath("/dashboard/products");
    return { success: true, product };
  } catch (error: any) {
    console.error("PRISMA ERROR:", error);
    
    let errorMessage = "Something went wrong while publishing the product.";
    if (error.code === 'P2002') {
      errorMessage = "A product with this name (or slug) already exists.";
    } else if (error.message) {
      errorMessage = `Error: ${error.message.split('\n')[0]}`;
    }

    return { success: false, error: errorMessage };
  }
}

export async function updateProduct(formData: any) {
  try {
    const {
      id,
      name,
      description,
      price,
      stock,
      category,
      unit,
      unitOptions,
      colors,
      variations,
      status,
      isFeatured,
      image,
      hoverImage,
    } = formData;

    if (!id) {
      return { success: false, error: "Product id is required." };
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const categoryRecord = await prisma.category.upsert({
      where: { slug: category.toLowerCase().replace(/ /g, "-") },
      update: {},
      create: {
        name: category,
        slug: category.toLowerCase().replace(/ /g, "-"),
      },
    });

    const colorConnections = await Promise.all(
      colors.map(async (c: { name: string; hex: string; code?: string }) => {
        return prisma.color.upsert({
          where: { hex: c.hex },
          update: {
            name: c.name,
            code: c.code || null,
          },
          create: {
            name: c.name,
            hex: c.hex,
            code: c.code || null,
          },
        });
      })
    );

    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct && existingProduct.id !== id) {
      return {
        success: false,
        error: `A product with the name "${name}" already exists. Please choose a different name.`,
      };
    }

    const normalizedUnitOptions = normalizeProductUnitOptions(unitOptions, {
      price,
      stock,
      unit,
    });
    const primaryUnitOption = normalizedUnitOptions[0];

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        priceInCents: primaryUnitOption.priceInCents,
        compareAtPriceInCents: primaryUnitOption.compareAtPriceInCents,
        stock: primaryUnitOption.stock,
        unit: primaryUnitOption.label,
        isFeatured: Boolean(isFeatured),
        image,
        hoverImage,
        categoryId: categoryRecord.id,
        colors: {
          set: colorConnections.map((c) => ({ id: c.id })),
        },
        unitOptions: {
          deleteMany: {},
          create: normalizedUnitOptions,
        },
        variations: {
          deleteMany: {},
          create: variations.map((v: { name: string; value: string }) => ({
            type: v.name,
            value: v.value,
          })),
        },
      },
    });

    revalidatePath("/dashboard/products");
    revalidatePath("/");
    revalidatePath("/products");
    return { success: true, product };
  } catch (error: any) {
    console.error("PRISMA ERROR:", error);

    let errorMessage = "Something went wrong while updating the product.";
    if (error.code === "P2002") {
      errorMessage = "A product with this name (or slug) already exists.";
    } else if (error.message) {
      errorMessage = `Error: ${error.message.split("\n")[0]}`;
    }

    return { success: false, error: errorMessage };
  }
}

export async function deleteProduct(id: number) {
  try {
    // Cascading delete of variations and then the product
    await prisma.$transaction([
      // First, delete all variations associated with this product
      prisma.variation.deleteMany({
        where: { productId: id },
      }),
      // Then, delete the product itself
      prisma.product.delete({
        where: { id },
      }),
    ]);

    revalidatePath("/dashboard/products");
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/inventory");
    
  } catch (error: any) {
    console.error("PRISMA ERROR (Delete Product):", error);
    throw new Error(error?.message || "Failed to delete product.");
  }
}

export async function unpublishProduct(id: number) {
  try {
    await prisma.product.update({
      where: { id },
      data: { status: "Draft" },
    });
    revalidatePath("/dashboard/products");
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/inventory");
  } catch (error: any) {
    throw new Error(error?.message || "Failed to unpublish product.");
  }
}

export async function publishProduct(id: number) {
  try {
    await prisma.product.update({
      where: { id },
      data: { status: "Active" },
    });
    revalidatePath("/dashboard/products");
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/inventory");
  } catch (error: any) {
    throw new Error(error?.message || "Failed to publish product.");
  }
}

export async function toggleProductFeatured(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true, isFeatured: true },
    });

    if (!product) {
      throw new Error("Product not found.");
    }

    await prisma.product.update({
      where: { id },
      data: { isFeatured: !product.isFeatured },
    });

    revalidatePath("/dashboard/products");
    revalidatePath("/");
    revalidatePath("/products");
  } catch (error: any) {
    throw new Error(error?.message || "Failed to update featured product status.");
  }
}

// ──── Category Actions ────

export async function createCategory(
  _prevState: { success: boolean; error: string | null },
  formData: FormData
) {
  try {
    const name = formData.get("name") as string;
    const banner = formData.get("banner") as string | null;
    const featuredBanner = formData.get("featuredBanner") as string | null;
    const circleImage = formData.get("circleImage") as string | null;
    const circleColor = formData.get("circleColor") as string | null;
    const backgroundColor = formData.get("backgroundColor") as string | null;
    const isFeatured = formData.get("isFeatured") === "on";
    const parentId = await resolveParentCategoryId(formData.get("parentId"));

    if (!name?.trim()) {
      throw new Error("Category name is required.");
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        banner: banner?.trim() || null,
        featuredBanner: featuredBanner?.trim() || null,
        circleImage: circleImage?.trim() || null,
        circleColor: circleColor?.trim() || null,
        backgroundColor: backgroundColor?.trim() || null,
        isFeatured,
        parentId,
      },
    });

    revalidatePath("/dashboard/products/category");
    revalidatePath("/");
    return { success: true, error: null };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return {
        success: false,
        error: "A category with this name already exists.",
      };
    }

    if (error?.code === "P1001") {
      return {
        success: false,
        error: "The database is currently unreachable. Please try again in a moment.",
      };
    }

    return {
      success: false,
      error: error?.message || "Failed to create category.",
    };
  }
}

export async function updateCategory(id: number, formData: FormData) {
  try {
    const name = formData.get("name") as string | null;
    const description = formData.get("description") as string | null;
    const banner = formData.get("banner") as string | null;
    const featuredBanner = formData.get("featuredBanner") as string | null;
    const circleImage = formData.get("circleImage") as string | null;
    const circleColor = formData.get("circleColor") as string | null;
    const backgroundColor = formData.get("backgroundColor") as string | null;
    const isFeatured = formData.get("isFeatured") === "on";
    const parentId = await resolveParentCategoryId(formData.get("parentId"));

    await ensureValidCategoryParent(id, parentId);

    const existingCategory = await prisma.category.findUnique({
      where: { id },
      select: { id: true, slug: true },
    });

    if (!existingCategory) {
      throw new Error("Category not found.");
    }

    const updateData: any = {
      description: description?.trim() || null,
      banner: banner?.trim() || null,
      featuredBanner: featuredBanner?.trim() || null,
      circleImage: circleImage?.trim() || null,
      circleColor: circleColor?.trim() || null,
      backgroundColor: backgroundColor?.trim() || null,
      isFeatured,
      parentId,
    };

    if (name?.trim()) {
      const finalName = name.trim();
      const nextSlug = finalName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      if (nextSlug !== existingCategory.slug) {
        const duplicateCategory = await prisma.category.findUnique({
          where: { slug: nextSlug },
          select: { id: true },
        });

        if (duplicateCategory && duplicateCategory.id !== id) {
          throw new Error("A category with this name already exists.");
        }
      }

      const finalSlug = nextSlug;

      await prisma.$executeRaw`
        UPDATE "Category" 
        SET 
          "name" = ${finalName}, 
          "slug" = ${finalSlug}, 
          "description" = ${updateData.description}, 
          "banner" = ${updateData.banner}, 
          "featuredBanner" = ${updateData.featuredBanner}, 
          "circleImage" = ${updateData.circleImage}, 
          "circleColor" = ${updateData.circleColor}, 
          "backgroundColor" = ${updateData.backgroundColor}, 
          "isFeatured" = ${updateData.isFeatured}, 
          "parentId" = ${updateData.parentId}, 
          "updatedAt" = NOW() 
        WHERE "id" = ${id}
      `;
    } else {
      await prisma.$executeRaw`
        UPDATE "Category" 
        SET 
          "description" = ${updateData.description}, 
          "banner" = ${updateData.banner}, 
          "featuredBanner" = ${updateData.featuredBanner}, 
          "circleImage" = ${updateData.circleImage}, 
          "circleColor" = ${updateData.circleColor}, 
          "backgroundColor" = ${updateData.backgroundColor}, 
          "isFeatured" = ${updateData.isFeatured}, 
          "parentId" = ${updateData.parentId}, 
          "updatedAt" = NOW() 
        WHERE "id" = ${id}
      `;
    }

    revalidatePath("/dashboard/products/category");
    revalidatePath("/");
  } catch (error: any) {
    if (error?.code === "P2002") {
      throw new Error("A category with this name already exists.");
    }

    if (error?.code === "P2025") {
      throw new Error("Category not found.");
    }

    console.error("updateCategory error:", error);
    throw new Error(error?.message || "Failed to update category.");
  }
}

export async function deleteCategory(id: number) {
  try {
    // Find all products in this category so we can clean up FKs that
    // don't have onDelete cascade configured (OrderItem, Variation).
    const products = await prisma.product.findMany({
      where: { categoryId: id },
      select: { id: true },
    });
    const productIds = products.map((p) => p.id);

    await prisma.$transaction([
      // Detach child categories so they aren't deleted with the parent
      prisma.category.updateMany({
        where: { parentId: id },
        data: { parentId: null },
      }),
      // Remove dependent rows that block product deletion
      prisma.orderItem.deleteMany({
        where: { productId: { in: productIds } },
      }),
      prisma.variation.deleteMany({
        where: { productId: { in: productIds } },
      }),
      // ProductUnitOption already cascades on Product delete
      prisma.product.deleteMany({
        where: { categoryId: id },
      }),
      prisma.category.delete({
        where: { id },
      }),
    ]);

    revalidatePath("/dashboard/products/category");
    revalidatePath("/");
    revalidatePath("/dashboard/products");
    revalidatePath("/products");
    revalidatePath("/inventory");
  } catch (error: any) {
    console.error("PRISMA ERROR (Delete Category):", error);
    throw new Error(error?.message || "Failed to delete category.");
  }
}

export async function createUnit(
  _prevState: { success: boolean; error: string | null },
  formData: FormData
) {
  try {
    const name = (formData.get("name") as string)?.trim();
    const usage = (formData.get("usage") as string)?.trim();

    if (!name) {
      throw new Error("Unit name is required.");
    }

    const existing = await prisma.unit.findUnique({
      where: { name },
    });

    if (existing) {
      throw new Error("A unit with this name already exists.");
    }

    await prisma.unit.create({
      data: {
        name,
        usage: usage || null,
      },
    });

    revalidatePath("/dashboard/products/units");
    revalidatePath("/dashboard/products/add");
    revalidatePath("/dashboard/products");
    return { success: true, error: null };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to create unit.",
    };
  }
}

export async function updateUnit(
  id: number,
  _prevState: { success: boolean; error: string | null },
  formData: FormData
) {
  try {
    const name = (formData.get("name") as string)?.trim();
    const usage = (formData.get("usage") as string)?.trim();

    if (!name) {
      throw new Error("Unit name is required.");
    }

    const currentUnit = await prisma.unit.findUnique({
      where: { id },
    });

    if (!currentUnit) {
      throw new Error("Unit not found.");
    }

    const duplicate = await prisma.unit.findUnique({
      where: { name },
    });

    if (duplicate && duplicate.id !== id) {
      throw new Error("A unit with this name already exists.");
    }

    await prisma.$transaction([
      prisma.unit.update({
        where: { id },
        data: {
          name,
          usage: usage || null,
        },
      }),
      prisma.product.updateMany({
        where: { unit: currentUnit.name },
        data: { unit: name },
      }),
      prisma.productUnitOption.updateMany({
        where: { unit: currentUnit.name },
        data: { unit: name },
      }),
    ]);

    revalidatePath("/dashboard/products/units");
    revalidatePath(`/dashboard/products/units/${id}/edit`);
    revalidatePath("/dashboard/products/add");
    revalidatePath("/dashboard/products");
    revalidatePath("/products");
    return { success: true, error: null };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to update unit.",
    };
  }
}

export async function deleteUnit(id: number) {
  try {
    const unit = await prisma.unit.findUnique({
      where: { id },
    });

    if (!unit) {
      throw new Error("Unit not found.");
    }

    const [productCount, unitOptionCount] = await Promise.all([
      prisma.product.count({
        where: { unit: unit.name },
      }),
      prisma.productUnitOption.count({
        where: { unit: unit.name },
      }),
    ]);

    if (productCount > 0 || unitOptionCount > 0) {
      throw new Error("Cannot delete a unit that is assigned to products.");
    }

    await prisma.unit.delete({
      where: { id },
    });

    revalidatePath("/dashboard/products/units");
    revalidatePath("/dashboard/products/add");
    revalidatePath("/dashboard/products");
  } catch (error: any) {
    throw new Error(error?.message || "Failed to delete unit.");
  }
}

// ──── Reel Actions ────

export async function createReel(formData: FormData) {
  try {
    const video = formData.get("video") as string;
    const poster = formData.get("poster") as string;
    const productImage = formData.get("productImage") as string | null;
    const title = formData.get("title") as string;
    const price = formData.get("price") as string;
    const link = formData.get("link") as string;

    if (!video || !title || !price) {
      throw new Error("Missing required fields for Reel.");
    }

    const finalProductImage = productImage?.trim() || "https://res.cloudinary.com/dnvm4kuel/image/upload/v1741718000/placeholder_image.png";

    await prisma.$executeRawUnsafe(
      `INSERT INTO "Reel" (video, poster, "productImage", title, price, link, "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      video,
      poster || null,
      finalProductImage,
      title,
      price,
      link || "/products"
    );

    revalidatePath("/dashboard/content/reels");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create reel:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteReel(id: number) {
  try {
    await prisma.$executeRawUnsafe(`DELETE FROM "Reel" WHERE id = $1`, id);
    revalidatePath("/dashboard/content/reels");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete reel:", error);
    return { success: false, error: error.message };
  }
}

// ──── Order Actions ────

export async function createOrder(data: any) {
  try {
    const orderNumber = `RB-${Math.floor(100000 + Math.random() * 900000)}`;
    const { items, customerName, email, phone, address, city, totalPrice } = data;

    // Use raw SQL to insert the order
    await prisma.$executeRawUnsafe(`
      INSERT INTO "Order" ("orderNumber", "totalCents", "status", "customerName", "email", "phone", "address", "city", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
    `, orderNumber, parseInt(totalPrice), "Pending", customerName, email, phone, address, city);

    // Get the newly created order's ID
    const orders: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "Order" WHERE "orderNumber" = $1 LIMIT 1`, orderNumber);
    if (orders.length === 0) throw new Error("Failed to retrieve created order");
    const orderId = orders[0].id;

    // Insert order items
    for (const item of items) {
      await prisma.$executeRawUnsafe(`
        INSERT INTO "OrderItem" ("productId", "quantity", "price", "orderId")
        VALUES ($1, $2, $3, $4)
      `, item.id, item.quantity, item.price, orderId);
    }

    return { success: true, orderNumber };
  } catch (err: any) {
    console.error("Order creation error:", err);
    return { success: false, error: err.message || "Failed to create order" };
  }
}

export async function getOrder(orderNumber: string) {
  try {
    const orders: any[] = await prisma.$queryRawUnsafe(`
      SELECT * FROM "Order" WHERE "orderNumber" = $1 LIMIT 1
    `, orderNumber);
    
    if (orders.length === 0) return null;
    
    const order = orders[0];
    
    // Get items for this order
    const items: any[] = await prisma.$queryRawUnsafe(`
      SELECT oi.*, p.name, p.image 
      FROM "OrderItem" oi
      JOIN "Product" p ON oi."productId" = p.id
      WHERE oi."orderId" = $1
    `, order.id);
    
    return { ...order, items };
  } catch (err) {
    console.error("Error fetching order:", err);
    return null;
  }
}

export async function updateOrderStatus(orderId: number, status: string) {
  try {
    await prisma.$executeRawUnsafe(`
      UPDATE "Order" SET "status" = $1, "updatedAt" = NOW() WHERE "id" = $2
    `, status, orderId);
    revalidatePath("/dashboard/orders");
    revalidatePath("/track-order");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ──── Client Auth Actions ────

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function registerClient(data: any) {
  try {
    const fullName = data.fullName;
    const phone = data.phone.trim();
    const password = data.password;
    const hashedPassword = hashPassword(password);

    console.log(`Attempting to register user: ${phone}`);

    // Check if user already exists
    const existing: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "User" WHERE "phone" = $1 LIMIT 1`, phone);
    if (existing.length > 0) {
      return { success: false, error: "A user with this phone number already exists." };
    }

    // Insert user
    await prisma.$executeRawUnsafe(`
      INSERT INTO "User" ("fullName", "phone", "password", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, NOW(), NOW())
    `, fullName, phone, hashedPassword);

    console.log(`User registered successfully: ${phone}`);
    return { success: true };
  } catch (err: any) {
    console.error("Registration error:", err);
    return { success: false, error: err.message || "Failed to create account" };
  }
}

export async function signinClient(data: any) {
  try {
    const phone = data.phone.trim();
    const password = data.password;
    const hashedPassword = hashPassword(password);

    console.log(`Login attempt for: ${phone}`);

    const users: any[] = await prisma.$queryRawUnsafe(`
      SELECT "id", "fullName", "phone" FROM "User" 
      WHERE "phone" = $1 AND "password" = $2 LIMIT 1
    `, phone, hashedPassword);

    if (users.length === 0) {
      console.log(`Login failed for: ${phone}`);
      return { success: false, error: "Invalid phone number or password." };
    }

    console.log(`Login successful for: ${phone}`);
    // Success - user is authenticated
    return { success: true, user: users[0] };
  } catch (err: any) {
    console.error("Signin error:", err);
    return { success: false, error: "Authentication failed. Server issue." };
  }
}
