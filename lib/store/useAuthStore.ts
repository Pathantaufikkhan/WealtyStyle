import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, ShippingAddress } from '@/types';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  // Actions
  login: (user: UserProfile) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  addAddress: (address: ShippingAddress) => void;
  updateAddress: (index: number, address: ShippingAddress) => void;
  deleteAddress: (index: number) => void;
  setDefaultAddress: (index: number) => void;
}

const demoCustomerUser: UserProfile = {
  id: 'usr-demo-01',
  email: 'siddharth.verma@glamstep.luxury',
  fullName: 'Siddharth Verma',
  phone: '9876543210',
  role: 'customer',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  savedAddresses: [
    {
      fullName: 'Siddharth Verma',
      email: 'siddharth.verma@glamstep.luxury',
      phone: '9876543210',
      houseFlat: 'Penthouse 1402, Tower 4',
      street: 'Golf Course Road',
      area: 'DLF Phase 5',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      landmark: 'Opposite Horizon Centre',
      isDefault: true,
    },
    {
      fullName: 'Siddharth Verma (Studio)',
      email: 'siddharth.verma@glamstep.luxury',
      phone: '9876543210',
      houseFlat: 'Studio 7A, Design House',
      street: 'Indiranagar 100 Feet Rd',
      area: 'HAL 2nd Stage',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      landmark: 'Near Toit',
      isDefault: false,
    },
  ],
  createdAt: '2024-01-01T00:00:00Z',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: demoCustomerUser,
      isAuthenticated: true,
      isAdmin: false,

      login: (user) => {
        set({
          user,
          isAuthenticated: true,
          isAdmin: user.role === 'admin',
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },

      updateProfile: (data) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: { ...state.user, ...data },
          };
        });
      },

      addAddress: (address) => {
        set((state) => {
          if (!state.user) return state;
          const current = [...state.user.savedAddresses];
          if (address.isDefault) {
            current.forEach((a) => (a.isDefault = false));
          }
          return {
            user: {
              ...state.user,
              savedAddresses: [...current, address],
            },
          };
        });
      },

      updateAddress: (index, address) => {
        set((state) => {
          if (!state.user) return state;
          const current = [...state.user.savedAddresses];
          if (address.isDefault) {
            current.forEach((a) => (a.isDefault = false));
          }
          current[index] = address;
          return {
            user: {
              ...state.user,
              savedAddresses: current,
            },
          };
        });
      },

      deleteAddress: (index) => {
        set((state) => {
          if (!state.user) return state;
          const current = state.user.savedAddresses.filter((_, i) => i !== index);
          return {
            user: {
              ...state.user,
              savedAddresses: current,
            },
          };
        });
      },

      setDefaultAddress: (index) => {
        set((state) => {
          if (!state.user) return state;
          const current = state.user.savedAddresses.map((addr, i) => ({
            ...addr,
            isDefault: i === index,
          }));
          return {
            user: {
              ...state.user,
              savedAddresses: current,
            },
          };
        });
      },
    }),
    {
      name: 'glamstep_auth_store_v1',
    }
  )
);
