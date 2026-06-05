import type { State, City } from "./animal.types";

export type ProductStatus = "ACTIVE" | "OUT_OF_STOCK" | "ARCHIVED";
export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface CloudinaryImage {
  url: string;
  public_id: string;
  secure_url?: string;
}

export interface BrandLocation {
  id: string;
  brandId: string;
  latitude: string | number | null;
  longitude: string | number | null;
  stateId: string;
  cityId: string;
  state: State;
  city: City;
  createdAt: string;
  updatedAt: string;
}

export interface BrandProfile {
  id: string;
  userId: string;
  brandName: string;
  slug: string;
  description: string | null;
  logoUrl: CloudinaryImage | null;
  bannerUrl: CloudinaryImage | null;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  gstNumber: string | null;
  isVerified: boolean;
  isActive: boolean;
  rating: string | number;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  brandLocations?: BrandLocation[];
  user?: {
    id: string;
    name: string | null;
    phone: string;
    avatarUrl?: any;
    email?: string | null;
  };
  distance?: number;
}

export interface MarketplaceCategory {
  id: string;
  name: string;
  brandId: string;
  description: string | null;
  parentId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  parent?: MarketplaceCategory | null;
  children?: MarketplaceCategory[];
}

export interface MarketplaceProduct {
  id: string;
  brandId: string;
  categoryId: string;
  title: string;
  slug: string;
  description: string;
  status: ProductStatus;
  metaTitle: string | null;
  metaDescription: string | null;
  images: CloudinaryImage[] | null;
  attributes: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  brand?: BrandProfile;
  category?: MarketplaceCategory;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  title: string;
  price: string | number;
  compareAtPrice: string | number | null;
  stock: number;
  imageUrl: CloudinaryImage | null;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string | null;
  images: CloudinaryImage[] | null;
  isVerifiedPurchase: boolean;
  sellerReply: string | null;
  createdAt: string;
  
  // Relations
  user?: {
    id: string;
    name: string | null;
    avatarUrl?: any;
  };
  product?: MarketplaceProduct;
}

export interface CartItem {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
  total: string | number;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  variant?: ProductVariant & {
    product?: {
      id: string;
      title: string;
      slug: string;
      images: CloudinaryImage[] | null;
    };
  };
}

export interface Cart {
  id: string;
  userId: string;
  subTotal: string | number;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  cartItems?: CartItem[];
}

// REQUEST & RESPONSE PAYLOAD INTERFACES

// Brands
export interface RegisterBrandRequest {
  brandName: string;
  slug: string;
  description?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  address?: string | null;
  gstNumber?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  stateName: string;
  stateCode?: string | null;
  stateLatitude?: number | null;
  stateLongitude?: number | null;
  cityName: string;
  cityLatitude?: number | null;
  cityLongitude?: number | null;
  logo?: File;
  banner?: File;
}

export interface UpdateBrandRequest {
  brandName?: string;
  slug?: string;
  description?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  address?: string | null;
  gstNumber?: string | null;
  isActive?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  stateName?: string;
  stateCode?: string | null;
  stateLatitude?: number | null;
  stateLongitude?: number | null;
  cityName?: string;
  cityLatitude?: number | null;
  cityLongitude?: number | null;
  logo?: File;
  banner?: File;
}

export interface GetBrandsByLocationParams {
  latitude: number;
  longitude: number;
  radius?: number;
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetBrandsByLocationResponseData {
  brands: BrandProfile[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    count: number;
  };
}

// Categories
export interface CreateCategoryRequest {
  name: string;
  brandId: string;
  description?: string | null;
  parentId?: string | null;
  isActive?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string | null;
  parentId?: string | null;
  isActive?: boolean;
}

export interface GetCategoriesParams {
  brandId?: string;
  parentId?: string | null;
  isActive?: boolean;
}

// Products
export interface CreateProductRequest {
  brandId: string;
  categoryId: string;
  title: string;
  description: string;
  status?: ProductStatus;
  metaTitle?: string | null;
  metaDescription?: string | null;
  images?: File[];
  attributes?: Record<string, any> | null;
  sku?: string;
  price?: number;
  compareAtPrice?: number | null;
  stock?: number;
  variants?: {
    sku: string;
    title: string;
    price: number;
    compareAtPrice?: number | null;
    stock?: number;
    isActive?: boolean;
    isDefault?: boolean;
  }[];
}

export interface UpdateProductRequest {
  categoryId?: string;
  title?: string;
  description?: string;
  status?: ProductStatus;
  metaTitle?: string | null;
  metaDescription?: string | null;
  images?: File[];
  attributes?: Record<string, any> | null;
  keepImages?: CloudinaryImage[] | null;
}

export interface GetProductsParams {
  brandId?: string;
  categoryId?: string;
  status?: ProductStatus;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface GetProductsResponseData {
  products: MarketplaceProduct[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Variants
export interface CreateVariantRequest {
  sku: string;
  title: string;
  price: number;
  compareAtPrice?: number | null;
  stock?: number;
  isActive?: boolean;
  isDefault?: boolean;
  image?: File;
}

export interface UpdateVariantRequest {
  sku?: string;
  title?: string;
  price?: number;
  compareAtPrice?: number | null;
  stock?: number;
  isActive?: boolean;
  isDefault?: boolean;
  image?: File;
}

// Reviews
export interface CreateReviewRequest {
  rating: number;
  comment?: string | null;
  images?: File[];
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string | null;
  images?: File[];
  keepImages?: CloudinaryImage[] | null;
}

export interface GetProductReviewsParams {
  rating?: number;
  page?: number;
  limit?: number;
}

export interface GetProductReviewsResponseData {
  reviews: ProductReview[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  stats: {
    averageRating: number;
    totalReviews: number;
    breakdown: {
      "1": number;
      "2": number;
      "3": number;
      "4": number;
      "5": number;
    };
  };
}

// Cart
export interface AddToCartRequest {
  variantId: string;
  quantity?: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
