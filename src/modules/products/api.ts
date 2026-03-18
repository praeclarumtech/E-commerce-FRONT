import api from "../../shared/api";
import type { PaginationParams } from "../../shared/interface";
import type { Product } from "./interface";
import type { CreateProductParams, UpdateProductParams } from "./interface";

export function getProducts({ params }: { params?: PaginationParams }) {
  return api.get("/products", { params });
}

export function getProductById(id: string) {
  return api.get<{ data: Product }>(`/products/${id}`);
}

function buildProductFormData(payload: {
  categoryId: string;
  subCategoryId?: string;
  userId?: string;
  name: string;
  description?: string;
  price: number;
  isActive?: boolean;
  status?: string;
  brandId?: string;
  brandName?: string;
  rating?: number;
  comment?: string;
  bannerImage?: File | string;
  brandLogo?: File | string;
  showInBanner?: boolean;
  images?: File[];
  removedImages?: string[];
}): FormData {
  const formData = new FormData();
  formData.append("categoryId", payload.categoryId);
  if (payload.subCategoryId) formData.append("subCategoryId", payload.subCategoryId);
  if (payload.userId) formData.append("userId", payload.userId);
  formData.append("name", payload.name);
  formData.append("price", String(payload.price));
  if (payload.description !== undefined) formData.append("description", payload.description);
  if (payload.isActive !== undefined) formData.append("isActive", String(payload.isActive));
  if (payload.status) formData.append("status", payload.status);
  if (payload.showInBanner !== undefined) formData.append("showInBanner", String(payload.showInBanner));
  if (payload.brandId) formData.append("brandId", payload.brandId);
  if (payload.brandName !== undefined) formData.append("brandName", payload.brandName);
  if (payload.rating !== undefined && payload.rating !== null) formData.append("rating", String(payload.rating));
  if (payload.comment !== undefined) formData.append("comment", payload.comment);
  if (payload.bannerImage) {
    if (payload.bannerImage instanceof File) formData.append("bannerImage", payload.bannerImage);
    else formData.append("bannerImage", payload.bannerImage);
  }
  if (payload.brandLogo) {
    if (payload.brandLogo instanceof File) formData.append("brandLogo", payload.brandLogo);
    else formData.append("brandLogo", payload.brandLogo);
  }
  if (payload.images?.length) {
    payload.images.forEach((image) => formData.append("images", image));
  }
  if (payload.removedImages?.length) {
    formData.append("removedImages", JSON.stringify(payload.removedImages));
  }
  return formData;
}

export function createProduct(data: CreateProductParams) {
  const formData = buildProductFormData({
    categoryId: data.categoryId,
    subCategoryId: data.subCategoryId,
    userId: data.userId,
    name: data.name,
    description: data.description,
    price: data.price,
    isActive: data.isActive,
    status: data.status,
    brandId: data.brandId,
    brandName: data.brandName,
    rating: data.rating,
    comment: data.comment,
    bannerImage: data.bannerImage,
    brandLogo: data.brandLogo,
    showInBanner: data.showInBanner,
    images: data.images,
  });
  return api.post("/products", formData);
}

export function updateProduct({ id, data }: { id: string; data: UpdateProductParams }) {
  const formData = new FormData();
  if (data.categoryId !== undefined) formData.append("categoryId", data.categoryId);
  if (data.subCategoryId !== undefined) formData.append("subCategoryId", data.subCategoryId);
  if (data.name !== undefined) formData.append("name", data.name);
  if (data.description !== undefined) formData.append("description", data.description);
  if (data.price !== undefined) formData.append("price", String(data.price));
  if (data.isActive !== undefined) formData.append("isActive", String(data.isActive));
  if (data.status !== undefined) formData.append("status", data.status);
  if (data.showInBanner !== undefined) formData.append("showInBanner", String(data.showInBanner));
  if (data.brandId !== undefined) formData.append("brandId", data.brandId);
  if (data.brandName !== undefined) formData.append("brandName", data.brandName);
  if (data.rating !== undefined && data.rating !== null) formData.append("rating", String(data.rating));
  if (data.comment !== undefined) formData.append("comment", data.comment);
  if (data.bannerImage) {
    if (data.bannerImage instanceof File) formData.append("bannerImage", data.bannerImage);
    else formData.append("bannerImage", data.bannerImage);
  }
  if (data.brandLogo) {
    if (data.brandLogo instanceof File) formData.append("brandLogo", data.brandLogo);
    else formData.append("brandLogo", data.brandLogo);
  }
  if (data.images?.length) data.images.forEach((image) => formData.append("images", image));
  if (data.removedImages?.length) formData.append("removedImages", JSON.stringify(data.removedImages));
  return api.put(`/products/${id}`, formData);
}

export function deleteProduct(id: string) {
  return api.delete(`/products/${id}`);
}

// --- Variant API (separate from product; variant id is not sent on product API) ---

export interface VariantCreatePayload {
  productId: string;
  price: number;
  stock: number;
  sku?: string;
  attributes: Record<string, string>;
  images?: File[];
}

export interface VariantImage {
  _id?: string;
  imageUrl: string;
  isPrimary?: boolean;
}

export interface VariantResponse {
  _id: string;
  productId: string;
  price: number;
  stock: number;
  sku?: string;
  attributes: Record<string, string>;
  images?: VariantImage[];
  createdAt?: string;
  updatedAt?: string;
}

/** GET product/:productId - Get all variants for product */
export function getVariantsByProductId(productId: string) {
  return api.get<{ data: VariantResponse[] }>(`/variants/product/${productId}`);
}

export function createVariant(payload: VariantCreatePayload) {
  if (payload.images?.length) {
    const formData = new FormData();
    formData.append("productId", payload.productId);
    formData.append("price", String(payload.price));
    formData.append("stock", String(payload.stock));
    if (payload.sku) formData.append("sku", payload.sku);
    formData.append("attributes", JSON.stringify(payload.attributes));
    payload.images.forEach((file) => formData.append("images", file));
    return api.post<{ data: VariantResponse }>("/variants", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return api.post<{ data: VariantResponse }>("/variants", payload);
}

export function deleteVariant(variantId: string) {
  return api.delete(`/variants/${variantId}`);
}
