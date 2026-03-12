export enum ENUM_PRODUCT_STATUS {
  DRAFT = "Draft",
  SAVED = "Saved",
  PUBLISH = "Publish",
}

export type ProductCategory = {
  _id: string;
  name: string;
};

export type ProductSubCategory = {
  _id: string;
  name: string;
};

export type ProductUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type ProductVariant = {
  name: string;
  value: string;
};

export type Product = {
  _id: string;
  categoryId: string | ProductCategory;
  subCategoryId: string | ProductSubCategory;
  userId: string | ProductUser;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  status: ENUM_PRODUCT_STATUS;
  variants?: ProductVariant[];
  images?: string[] | { _id?: string; imageUrl?: string }[];
  bannerImage?: string;
  brandName?: string;
  brandLogo?: string;
  rating?: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductFormValues = {
  categoryId: string;
  subCategoryId: string;
  name: string;
  description?: string;
  price: number;
  isActive?: boolean;
  status?: ENUM_PRODUCT_STATUS;
  brandName?: string;
  rating?: number;
  comment?: string;
};

export type CreateProductParams = {
  categoryId: string;
  subCategoryId?: string;
  userId: string;
  name: string;
  description?: string;
  price: number;
  isActive?: boolean;
  status?: string;
  images?: File[];
  bannerImage?: File | string;
  brandName?: string;
  brandLogo?: File | string;
  rating?: number;
  comment?: string;
};

export type UpdateProductParams = {
  categoryId?: string;
  subCategoryId?: string;
  name?: string;
  description?: string;
  price?: number;
  isActive?: boolean;
  status?: string;
  images?: File[];
  removedImages?: string[];
  bannerImage?: File | string;
  brandName?: string;
  brandLogo?: File | string;
  rating?: number;
  comment?: string;
};
