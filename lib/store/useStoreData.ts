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
    (set) => ({
      products: initialProducts,
      orders: initialOrders,
      coupons: initialCoupons,
      reviews: initialReviews,

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
