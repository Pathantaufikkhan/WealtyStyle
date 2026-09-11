export type CategorySlug = 'sunglasses' | 'shoes' | 'watches';

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  originalPrice?: number;
  colorName?: string;
  colorHex?: string;
  size?: string;
  stock: number;
  image?: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  status: 'approved' | 'pending' | 'rejected';
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  brand: string;
  category: CategorySlug;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  description: string;
  shortDescription: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  inStock: boolean;
  stockCount: number;
  tags: string[];
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  materials: string[];
  dimensions?: string;
  careInstructions: string[];
  warranty: string;
  createdAt: string;
  // Specific filters
  attributes: {
    frameShape?: string;
    frameColor?: string;
    lensColor?: string;
    uvProtection?: string;
    lensType?: string;
    shoeSize?: string[];
    shoeColor?: string;
    shoeMaterial?: string;
    shoeStyle?: string;
    watchMovement?: string;
    watchStrap?: string;
    watchDialColor?: string;
    watchCaseShape?: string;
    watchWaterResistance?: string;
    gender?: 'Men' | 'Women' | 'Unisex';
  };
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedVariant?: ProductVariant;
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  houseFlat: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
}

export type OrderStatus =
  | 'Pending'
  | 'Payment Pending'
  | 'Paid'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'
  | 'Refunded';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  category: CategorySlug;
  price: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingCost: number;
  tax: number;
  grandTotal: number;
  advancePaid?: number;
  balanceDue?: number;
  paymentMethod: 'Razorpay' | 'COD' | 'Advance_COD' | 'UPI' | 'Card';
  paymentStatus: 'Pending' | 'Paid' | 'Partially Paid' | 'Failed' | 'Refunded';
  paymentId?: string;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  recoveryEmail?: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: 'customer' | 'admin';
  savedAddresses: ShippingAddress[];
  createdAt: string;
}

export interface CategoryMeta {
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  featuredBanner: string;
  accentColor: string;
  filters: {
    name: string;
    key: string;
    options: { label: string; value: string; count?: number }[];
  }[];
}
