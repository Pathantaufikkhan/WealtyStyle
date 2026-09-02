import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  houseFlat: z.string().min(1, "House / Flat / Building is required"),
  street: z.string().min(3, "Street / Road name is required"),
  area: z.string().min(2, "Area / Locality is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z
    .string()
    .regex(/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit PIN code"),
  landmark: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export const checkoutSchema = z.object({
  customer: z.object({
    fullName: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email is required"),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile number required"),
  }),
  shippingAddress: addressSchema,
  paymentMethod: z.enum(["Razorpay", "COD", "UPI", "Card"]),
  couponCode: z.string().optional(),
});

export const reviewSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  userName: z.string().min(2, "Name must be at least 2 characters"),
  rating: z.number().min(1, "Rating must be between 1 and 5").max(5),
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  comment: z.string().min(10, "Review comment must be at least 10 characters").max(1000),
});

export const couponValidateSchema = z.object({
  code: z.string().min(2, "Coupon code is required"),
  cartTotal: z.number().min(0, "Cart total must be positive"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
