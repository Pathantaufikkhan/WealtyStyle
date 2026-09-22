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
  isSyncing: boolean;
  isSyncedOnce: boolean;
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
      isSyncing: false,
      isSyncedOnce: false,

      syncWithSupabase: async () => {
        if (get().isSyncing) return;
        set({ isSyncing: true });
        try {
          // 1. Sync Products
          const productsFetch = await fetch('/api/products');
          if (!productsFetch.ok) throw new Error(`Products fetch failed: ${productsFetch.statusText}`);
          const res = await productsFetch.json();
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

          // 2. Sync Orders in Real-Time
          const ordersFetch = await fetch('/api/orders');
          if (!ordersFetch.ok) throw new Error(`Orders fetch failed: ${ordersFetch.statusText}`);
          const ordersRes = await ordersFetch.json();
          if (ordersRes?.success && Array.isArray(ordersRes.orders) && ordersRes.orders.length > 0) {
            const formattedOrders: Order[] = ordersRes.orders.map((o: any) => ({
              id: o.id,
              orderNumber: o.order_number,
              userId: o.user_id,
              customerName: o.customer_name,
              customerEmail: o.customer_email,
              customerPhone: o.customer_phone,
              shippingAddress: o.shipping_address || {},
              items: Array.isArray(o.items)
                ? o.items.map((i: any) => ({
                    id: i.id || `item-${Math.random().toString(36).substr(2, 9)}`,
                    productId: i.product_id,
                    productName: i.product_name || "Luxury Item",
                    productImage: i.product_image || "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop",
                    category: i.category || "sunglasses",
                    price: Number(i.price || 0),
                    quantity: Number(i.quantity || 1),
                    selectedColor: i.selected_color,
                    selectedSize: i.selected_size,
                  }))
                : [],
              subtotal: Number(o.subtotal || 0),
              discount: Number(o.discount || 0),
              couponCode: o.coupon_code,
              shippingCost: Number(o.shipping_cost || 0),
              tax: Number(o.tax || 0),
              grandTotal: Number(o.grand_total || 0),
              paymentMethod: o.payment_method || "Razorpay",
              paymentStatus: o.payment_status || "Paid",
              paymentId: o.payment_id,
              orderStatus: o.order_status || "Confirmed",
              trackingNumber: o.tracking_number,
              estimatedDelivery: o.estimated_delivery,
              createdAt: o.created_at || new Date().toISOString(),
              updatedAt: o.updated_at || new Date().toISOString(),
            }));

            set((state) => {
              const supabaseOrderNumbers = new Set(formattedOrders.map((ord) => ord.orderNumber));
              const remainingOrders = state.orders.filter((ord) => !supabaseOrderNumbers.has(ord.orderNumber));
              return { orders: [...formattedOrders, ...remainingOrders] };
            });
          }
          
          set({ isSyncedOnce: true, isSyncing: false });
        } catch (err) {
          set({ isSyncing: false });
          console.error("Supabase sync error:", err);
          throw err; // Re-throw so caller can display toast.error
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
