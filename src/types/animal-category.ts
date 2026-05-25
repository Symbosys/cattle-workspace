export interface CloudinaryImage {
  public_id: string;
  secure_url: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  imageUrl: CloudinaryImage | null;
  createdAt: string;
  updatedAt: string;
  subCategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  imageUrl: CloudinaryImage | null;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  image?: File;
}

export interface UpdateCategoryRequest {
  id: string;
  name?: string;
  description?: string;
  image?: File;
}

export interface CreateSubCategoryRequest {
  categoryId: string;
  name: string;
  description?: string;
  image?: File;
}

export interface UpdateSubCategoryRequest {
  id: string;
  categoryId?: string;
  name?: string;
  description?: string;
  image?: File;
}
