import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const isValidUUID = (str?: string): boolean =>
  typeof str === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

/**
 * POST /api/products
 * Inserts a new product into Supabase `products` table
 */
export async function POST(req: NextRequest) {
  try {
    const { product } = await req.json();

    if (!product || !product.name) {
      return NextResponse.json(
        { error: "Product name and details are required" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    const productPayload = {
      slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString().slice(-4),
      name: product.name,
      tagline: product.tagline || null,
      brand: product.brand || "WEALTHY STYLE",
      category_slug: product.category || "sunglasses",
      price: Number(product.price || 0),
      original_price: Number(product.originalPrice || product.price || 0),
      discount_percentage: Number(product.discountPercentage || 0),
      rating: Number(product.rating || 5.0),
      reviews_count: Number(product.reviewsCount || 0),
      description: product.description || product.name,
      short_description: product.shortDescription || (product.description ? product.description.substring(0, 100) : product.name),
      is_featured: !!product.isFeatured,
      is_bestseller: !!product.isBestSeller,
      is_new_arrival: !!product.isNewArrival,
      in_stock: product.inStock !== false,
      stock_count: Number(product.stockCount || 10),
      tags: product.tags || [],
      materials: product.materials || [],
      care_instructions: product.careInstructions || [],
      warranty: product.warranty || "2-Year International Warranty",
      created_at: product.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: insertedProduct, error } = await supabase
      .from("products")
      .upsert([productPayload], { onConflict: "slug" })
      .select()
      .single();

    if (error) {
      console.error("Supabase Product Insert Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Save images into `product_images` table if available
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      const imagesPayload = product.images.map((imgUrl: string, idx: number) => ({
        product_id: insertedProduct.id,
        image_url: imgUrl,
        display_order: idx,
      }));

      await supabase.from("product_images").insert(imagesPayload);
    }

    return NextResponse.json({
      success: true,
      message: "Product saved to Supabase",
      product: insertedProduct,
    });
  } catch (err: any) {
    console.error("API /api/products Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process product" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/products
 * Fetches products from Supabase
 */
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    const { data: products, error } = await supabase
      .from("products")
      .select(`
        *,
        images:product_images(image_url, display_order)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, products: products || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/products
 * Deletes a product from Supabase by slug or ID
 */
export async function DELETE(req: NextRequest) {
  try {
    const { slug, id } = await req.json();
    const supabase = createServerSupabaseClient();

    let query = supabase.from("products").delete();
    if (id && isValidUUID(id)) {
      query = query.eq("id", id);
    } else if (slug) {
      query = query.eq("slug", slug);
    } else {
      return NextResponse.json({ error: "id or slug required" }, { status: 400 });
    }

    const { error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Product deleted from Supabase" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
