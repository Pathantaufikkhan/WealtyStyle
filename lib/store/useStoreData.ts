import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Order, Coupon, ProductReview } from '@/types';
import { products as initialProducts } from '@/lib/data/products';
import { initialCoupons, initialReviews, initialOrders } from '@/lib/data/initialStore';

interface StoreDataState {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  reviews: ProductReview[];
  
  // Cloud Sync
  syncWithSupabase: () => Promise<void>;

  // Product actions
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Order actions
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['orderStatus'], trackingNumber?: string) => void;
  
  // Coupon actions
  addCoupon: (coupon: Coupon) => void;
  toggleCouponActive: (id: string) => void;
  deleteCoupon: (id: string) => void;
  
  // Review actions
  addReview: (review: ProductReview) => void;
  updateReviewStatus: (id: string, status: 'approved' | 'rejected') => void;
  deleteReview: (id: string) => void;
}

export const useStoreData = create<StoreDataState>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      orders: initialOrders,
      coupons: initialCoupons,
      reviews: initialReviews,

      syncWithSupabase: async () => {
        try {
          const res = await fetch('/api/products').then((r) => r.json()).catch(() => null);
          if (res?.success && Array.isArray(res.products) && res.products.length > 0) {
            const formattedSupabaseProducts: Product[] = res.products.map((p: any) => ({
              id: p.id,
              slug: p.slug,
              name: p.name,
              tagline: p.tagline || "Handcrafted Luxury",
              brand: p.brand || "WEALTHY STYLE",
              category: p.category_slug || "sunglasses",
              price: Number(p.price),
              originalPrice: Number(p.original_price || p.price),
              discountPercentage: Number(p.discount_percentage || 0),
              rating: Number(p.rating || 5.0),
              reviewsCount: Number(p.reviews_count || 0),
              description: p.description || p.name,
              shortDescription: p.short_description || (p.description ? p.description.substring(0, 100) : p.name),
              isFeatured: !!p.is_featured,
              isBestSeller: !!p.is_bestseller,
              isNewArrival: !!p.is_new_arrival,
              inStock: p.in_stock !== false,
              stockCount: Number(p.stock_count || 10),
              tags: p.tags || [p.category_slug || "Luxury"],
              materials: p.materials || ["Premium Alloy"],
              careInstructions: p.care_instructions || [],
              warranty: p.warranty || "2-Year International Warranty",
              images: p.images && p.images.length > 0
                ? p.images.map((img: any) => (typeof img === "string" ? img : img.image_url))
                : ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop"],
              createdAt: p.created_at || new Date().toISOString(),
              variants: [],
              specifications: [],
              attributes: p.attributes || {},
            }));

            set((state) => {
              const supabaseSlugs = new Set(formattedSupabaseProducts.map((p) => p.slug));
              const remaining = state.products.filter((p) => !supabaseSlugs.has(p.slug));
              return { products: [...formattedSupabaseProducts, ...remaining] };
            });
          }
        } catch (err) {
          console.error("Supabase products sync error:", err);
        }
      },

      addProduct: (product) => {
        set((state) => ({ products: [product, ...state.products] }));
      },

      updateProduct: (id, updatedFields) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updatedFields } : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      addOrder: (order) => {
        set((state) => ({ orders: [order, ...state.orders] }));
      },

      updateOrderStatus: (orderId, status, trackingNumber) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  orderStatus: status,
                  ...(trackingNumber ? { trackingNumber } : {}),
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        }));
      },

      addCoupon: (coupon) => {
        set((state) => ({ coupons: [coupon, ...state.coupons] }));
      },

      toggleCouponActive: (id) => {
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.id === id ? { ...c, isActive: !c.isActive } : c
          ),
        }));
      },

      deleteCoupon: (id) => {
        set((state) => ({
          coupons: state.coupons.filter((c) => c.id !== id),
        }));
      },

      addReview: (review) => {
        set((state) => ({ reviews: [review, ...state.reviews] }));
      },

      updateReviewStatus: (id, status) => {
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id ? { ...r, status } : r
          ),
        }));
      },

      deleteReview: (id) => {
        set((state) => ({
          reviews: state.reviews.filter((r) => r.id !== id),
        }));
      },
    }),
    {
      name: 'glamstep_store_data_v1',
    }
  )
);
