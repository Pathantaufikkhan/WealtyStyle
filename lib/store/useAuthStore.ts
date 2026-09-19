import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, ShippingAddress } from '@/types';

export interface RegisteredAccount {
  id: string;
  email: string;
  recoveryEmail?: string;
  password: string;
  fullName: string;
  phone?: string;
  role: 'customer' | 'admin';
  avatarUrl?: string;
  savedAddresses: ShippingAddress[];
  createdAt: string;
  isValuedMember?: boolean;
  membershipTier?: 'standard' | 'valued_client';
  membershipGrantedAt?: string;
  membershipMethod?: 'purchased' | 'auto_5_orders';
  notifiedMilestone3?: boolean;
  notifiedMilestone5?: boolean;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  registeredAccounts: RegisteredAccount[];
  
  // Actions
  login: (user: UserProfile) => void;
  loginWithCredentials: (email: string, password: string) => {
    success: boolean;
    error?: string;
    user?: UserProfile;
    isAdmin?: boolean;
  };
  registerUserAccount: (account: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    recoveryEmail?: string;
    role?: 'customer' | 'admin';
  }) => { success: boolean; error?: string };
  logout: () => void;
  elevateToAdmin: () => void;
  verifyAdminPasskey: (passkey: string) => boolean;
  grantValuedMembership: (method: 'purchased' | 'auto_5_orders') => void;
  setMilestoneNotified: (milestone: 3 | 5) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  updateRecoveryEmail: (recoveryEmail: string) => { success: boolean; error?: string };
  resetUserPassword: (email: string, newPassword: string) => {
    success: boolean;
    error?: string;
  };
  addAddress: (address: ShippingAddress) => void;
  updateAddress: (index: number, address: ShippingAddress) => void;
  deleteAddress: (index: number) => void;
  setDefaultAddress: (index: number) => void;
}

const defaultInitialAccounts: RegisteredAccount[] = [
  {
    id: 'usr-admin-01',
    email: 'admin@wealthstyle.luxury',
    password: 'luxury2025',
    fullName: 'Maison Administrator',
    phone: '9876543210',
    role: 'admin',
    savedAddresses: [],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'usr-admin-02',
    email: 'admin@glamstep.luxury',
    password: 'luxury2025',
    fullName: 'Maison Administrator',
    phone: '9876543210',
    role: 'admin',
    savedAddresses: [],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'usr-client-01',
    email: 'client@wealthstyle.luxury',
    password: 'luxury2025',
    fullName: 'Siddharth Verma',
    phone: '9876543210',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    savedAddresses: [
      {
        fullName: 'Siddharth Verma',
        email: 'client@wealthstyle.luxury',
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
    ],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'usr-tofik-01',
    email: 'pathant018@gmail.com',
    password: 'luxury2025',
    fullName: 'Tofik Pathan',
    phone: '9876543210',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    savedAddresses: [
      {
        fullName: 'Tofik Pathan',
        email: 'pathant018@gmail.com',
        phone: '9876543210',
        houseFlat: 'Suite 302, Luxury Heights',
        street: 'Park Avenue',
        area: 'Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
        isDefault: true,
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: defaultInitialAccounts[3],
      isAuthenticated: true,
      isAdmin: false,
      registeredAccounts: defaultInitialAccounts,

      loginWithCredentials: (email: string, password: string) => {
        const normalizedEmail = email.toLowerCase().trim();
        const accounts = get().registeredAccounts || defaultInitialAccounts;

        const foundAccount = accounts.find(
          (acc) => acc.email.toLowerCase().trim() === normalizedEmail
        );

        if (!foundAccount) {
          return {
            success: false,
            error: "No account found with this email address. Please create an account first.",
          };
        }

        if (foundAccount.password !== password) {
          return {
            success: false,
            error: "Incorrect password. Please verify your credentials and try again.",
          };
        }

        const userProfile: UserProfile = {
          id: foundAccount.id,
          email: foundAccount.email,
          recoveryEmail: foundAccount.recoveryEmail,
          fullName: foundAccount.fullName,
          phone: foundAccount.phone,
          role: foundAccount.role,
          avatarUrl: foundAccount.avatarUrl,
          savedAddresses: foundAccount.savedAddresses,
          createdAt: foundAccount.createdAt,
          isValuedMember: foundAccount.isValuedMember || false,
          membershipTier: foundAccount.membershipTier || 'standard',
          membershipGrantedAt: foundAccount.membershipGrantedAt,
          membershipMethod: foundAccount.membershipMethod,
          notifiedMilestone3: foundAccount.notifiedMilestone3,
          notifiedMilestone5: foundAccount.notifiedMilestone5,
        };

        const isAdmin = foundAccount.role === 'admin';

        set({
          user: userProfile,
          isAuthenticated: true,
          isAdmin,
        });

        return {
          success: true,
          user: userProfile,
          isAdmin,
        };
      },

      registerUserAccount: (data) => {
        const normalizedEmail = data.email.toLowerCase().trim();
        const currentAccounts = get().registeredAccounts || defaultInitialAccounts;

        const existing = currentAccounts.find(
          (acc) => acc.email.toLowerCase().trim() === normalizedEmail
        );

        if (existing) {
          return {
            success: false,
            error: "An account with this email address already exists. Please sign in instead.",
          };
        }

        const newAccount: RegisteredAccount = {
          id: `usr-${Date.now()}`,
          email: normalizedEmail,
          recoveryEmail: data.recoveryEmail ? data.recoveryEmail.toLowerCase().trim() : undefined,
          password: data.password,
          fullName: data.fullName.trim(),
          phone: data.phone?.trim() || '',
          role: data.role || 'customer',
          savedAddresses: [],
          createdAt: new Date().toISOString(),
        };

        const updatedAccounts = [...currentAccounts, newAccount];

        const userProfile: UserProfile = {
          id: newAccount.id,
          email: newAccount.email,
          recoveryEmail: newAccount.recoveryEmail,
          fullName: newAccount.fullName,
          phone: newAccount.phone,
          role: newAccount.role,
          savedAddresses: newAccount.savedAddresses,
          createdAt: newAccount.createdAt,
        };

        set({
          registeredAccounts: updatedAccounts,
          user: userProfile,
          isAuthenticated: true,
          isAdmin: newAccount.role === 'admin',
        });

        return { success: true };
      },

      updateRecoveryEmail: (recoveryEmail: string) => {
        const clean = recoveryEmail.toLowerCase().trim();
        const currentUser = get().user;
        const accounts = get().registeredAccounts || defaultInitialAccounts;

        if (currentUser && currentUser.email.toLowerCase().trim() === clean) {
          return {
            success: false,
            error: "Recovery email cannot be the same as your primary account email.",
          };
        }

        const isAlreadyUser = accounts.some(
          (acc) => acc.email.toLowerCase().trim() === clean
        );

        if (isAlreadyUser) {
          return {
            success: false,
            error: "This email is already registered as a user. Please try a different recovery email.",
          };
        }

        set((state) => {
          if (!state.user) return state;
          const updatedUser: UserProfile = {
            ...state.user,
            recoveryEmail: clean,
          };
          const updatedAccounts = (state.registeredAccounts || defaultInitialAccounts).map((acc) =>
            acc.id === updatedUser.id ? { ...acc, recoveryEmail: clean } : acc
          );
          return {
            user: updatedUser,
            registeredAccounts: updatedAccounts,
          };
        });

        return { success: true };
      },

      resetUserPassword: (email: string, newPassword: string) => {
        const normalizedEmail = email.toLowerCase().trim();
        const accounts = get().registeredAccounts || defaultInitialAccounts;

        const foundIndex = accounts.findIndex(
          (acc) => acc.email.toLowerCase().trim() === normalizedEmail
        );

        if (foundIndex === -1) {
          return {
            success: false,
            error: "Account not found.",
          };
        }

        const updatedAccounts = [...accounts];
        updatedAccounts[foundIndex] = {
          ...updatedAccounts[foundIndex],
          password: newPassword,
        };

        set((state) => ({
          registeredAccounts: updatedAccounts,
          user:
            state.user && state.user.email.toLowerCase().trim() === normalizedEmail
              ? { ...state.user }
              : state.user,
        }));

        return { success: true };
      },

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

      elevateToAdmin: () => {
        set((state) => {
          const current = state.user || defaultInitialAccounts[0];
          return {
            user: {
              ...current,
              role: 'admin',
              fullName: current.fullName || 'Maison Administrator',
              email: current.email || 'admin@wealthstyle.luxury',
            },
            isAuthenticated: true,
            isAdmin: true,
          };
        });
      },

      verifyAdminPasskey: (passkey: string) => {
        const clean = passkey.trim();
        const validKeys = [
          'luxury2025',
          'admin2025',
          'wealthstyle2025',
          'glamstep_admin_super_secret_token_2025',
          process.env.NEXT_PUBLIC_ADMIN_SECRET_TOKEN || '',
        ].filter(Boolean);

        if (validKeys.includes(clean)) {
          set((state) => {
            const current = state.user || defaultInitialAccounts[0];
            return {
              user: {
                ...current,
                role: 'admin',
                fullName: current.fullName || 'Maison Administrator',
                email: current.email || 'admin@wealthstyle.luxury',
              },
              isAuthenticated: true,
              isAdmin: true,
            };
          });
          return true;
        }
        return false;
      },

      grantValuedMembership: (method: 'purchased' | 'auto_5_orders') => {
        set((state) => {
          if (!state.user) return state;
          const updatedUser: UserProfile = {
            ...state.user,
            isValuedMember: true,
            membershipTier: 'valued_client',
            membershipGrantedAt: new Date().toISOString(),
            membershipMethod: method,
          };
          const updatedAccounts = state.registeredAccounts.map((acc) =>
            acc.id === updatedUser.id
              ? {
                  ...acc,
                  isValuedMember: true,
                  membershipTier: 'valued_client' as const,
                  membershipGrantedAt: updatedUser.membershipGrantedAt,
                  membershipMethod: method,
                }
              : acc
          );
          return {
            user: updatedUser,
            registeredAccounts: updatedAccounts,
          };
        });
      },

      setMilestoneNotified: (milestone: 3 | 5) => {
        set((state) => {
          if (!state.user) return state;
          const patch =
            milestone === 3
              ? { notifiedMilestone3: true }
              : { notifiedMilestone5: true };
          const updatedUser: UserProfile = {
            ...state.user,
            ...patch,
          };
          const updatedAccounts = state.registeredAccounts.map((acc) =>
            acc.id === updatedUser.id ? { ...acc, ...patch } : acc
          );
          return {
            user: updatedUser,
            registeredAccounts: updatedAccounts,
          };
        });
      },

      updateProfile: (data) => {
        set((state) => {
          if (!state.user) return state;
          const updatedUser = { ...state.user, ...data };
          const updatedAccounts = state.registeredAccounts.map((acc) =>
            acc.id === updatedUser.id ? { ...acc, ...data } : acc
          );
          return {
            user: updatedUser,
            registeredAccounts: updatedAccounts,
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
          const updatedUser = {
            ...state.user,
            savedAddresses: [...current, address],
          };
          const updatedAccounts = state.registeredAccounts.map((acc) =>
            acc.id === updatedUser.id ? { ...acc, savedAddresses: updatedUser.savedAddresses } : acc
          );
          return {
            user: updatedUser,
            registeredAccounts: updatedAccounts,
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
          const updatedUser = {
            ...state.user,
            savedAddresses: current,
          };
          const updatedAccounts = state.registeredAccounts.map((acc) =>
            acc.id === updatedUser.id ? { ...acc, savedAddresses: current } : acc
          );
          return {
            user: updatedUser,
            registeredAccounts: updatedAccounts,
          };
        });
      },

      deleteAddress: (index) => {
        set((state) => {
          if (!state.user) return state;
          const current = state.user.savedAddresses.filter((_, i) => i !== index);
          const updatedUser = {
            ...state.user,
            savedAddresses: current,
          };
          const updatedAccounts = state.registeredAccounts.map((acc) =>
            acc.id === updatedUser.id ? { ...acc, savedAddresses: current } : acc
          );
          return {
            user: updatedUser,
            registeredAccounts: updatedAccounts,
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
          const updatedUser = {
            ...state.user,
            savedAddresses: current,
          };
          const updatedAccounts = state.registeredAccounts.map((acc) =>
            acc.id === updatedUser.id ? { ...acc, savedAddresses: current } : acc
          );
          return {
            user: updatedUser,
            registeredAccounts: updatedAccounts,
          };
        });
      },
    }),
    {
      name: 'wealthstyle_auth_store_v2',
    }
  )
);
