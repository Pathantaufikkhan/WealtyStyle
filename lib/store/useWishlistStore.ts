import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface WishlistState {
  items: Product[];
  
  // Actions
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleWishlist: (product: Product) => boolean; // returns true if added, false if removed
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          if (state.items.some((item) => item.id === product.id)) return state;
          return { items: [...state.items, product] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      toggleWishlist: (product) => {
        const inList = get().isInWishlist(product.id);
        if (inList) {
          get().removeItem(product.id);
          return false;
        } else {
          get().addItem(product);
          return true;
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'glamstep_wishlist_store_v1',
    }
  )
);
