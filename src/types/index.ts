// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  category: Category;
  subcategory?: string;
  sizes: Size[];
  colors: Color[];
  stockQuantity: number;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  materials?: string[];
  careInstructions?: string[];
  madeIn?: string;
  sku: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface Size {
  id: string;
  name: string;
  inStock: boolean;
}

export interface Color {
  id: string;
  name: string;
  hex: string;
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

// Cart Types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize: Size;
  selectedColor: Color;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  addresses?: Address[];
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  user: User;
  items: CartItem[];
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

// Collection Types
export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  products: Product[];
  featured: boolean;
  isFeatured?: boolean; // Added alias for consistency if needed
}

// Newsletter Types
export interface NewsletterSubscription {
  email: string;
  subscribedAt: Date;
}

// Navigation Types
export interface NavigationItem {
  name: string;
  href: string;
  submenu?: NavigationItem[];
}
