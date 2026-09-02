import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductVariant, Coupon } from '@/types';

export const FREE_SHIPPING_THRESHOLD = 2499;
export const STANDARD_SHIPPING_FEE = 199;

interface CartState {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  isCartDrawerOpen: boolean;
  
  // Actions
  addItem: (product: Product, selectedVariant?: ProductVariant, selectedColor?: string, selectedSize?: string, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  toggleCartDrawer: (open?: boolean) => void;
  
  // Computed values
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: () => number;
  getGrandTotal: () => number;
  getItemCount: () => number;
  getFreeShippingProgress: () => {
    threshold: number;
    amountNeeded: number;
    progressPercentage: number;
    isQualified: boolean;
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      isCartDrawerOpen: false,

      addItem: (product, selectedVariant, selectedColor, selectedSize, quantity = 1) => {
        set((state) => {
          const variantKey = `${product.id}_${selectedVariant?.id || 'default'}_${selectedColor || ''}_${selectedSize || ''}`;
          const existingIndex = state.items.findIndex((item) => item.id === variantKey);

          const itemPrice = selectedVariant?.price || product.price;

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += quantity;
            return { items: updatedItems, isCartDrawerOpen: true };
          }

          const newItem: CartItem = {
            id: variantKey,
            productId: product.id,
            product,
            selectedVariant,
            selectedColor: selectedColor || selectedVariant?.colorName || (product.variants?.[0]?.colorName),
            selectedSize: selectedSize || selectedVariant?.size || (product.variants?.[0]?.size),
            quantity,
            price: itemPrice,
          };

          return {
            items: [...state.items, newItem],
            isCartDrawerOpen: true,
          };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null });
      },

      applyCoupon: (coupon) => {
        set({ appliedCoupon: coupon });
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      toggleCartDrawer: (open) => {
        set((state) => ({
          isCartDrawerOpen: open !== undefined ? open : !state.isCartDrawerOpen,
        }));
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const coupon = get().appliedCoupon;
        if (!coupon || subtotal < coupon.minOrderValue) return 0;

        if (coupon.discountType === 'percentage') {
          const rawDiscount = (subtotal * coupon.discountValue) / 100;
          return coupon.maxDiscount ? Math.min(rawDiscount, coupon.maxDiscount) : rawDiscount;
        }

        return coupon.discountValue;
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) {
          return 0;
        }
        return STANDARD_SHIPPING_FEE;
      },

      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingFee();
        return Math.max(0, subtotal - discount + shipping);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      getFreeShippingProgress: () => {
        const subtotal = get().getSubtotal();
        const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
        const progressPercentage = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
        return {
          threshold: FREE_SHIPPING_THRESHOLD,
          amountNeeded,
          progressPercentage,
          isQualified: subtotal >= FREE_SHIPPING_THRESHOLD,
        };
      },
    }),
    {
      name: 'glamstep_cart_store_v1',
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
      }),
    }
  )
);
