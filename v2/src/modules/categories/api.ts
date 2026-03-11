import api from "../../shared/api";
import type { PaginationParams } from "../../shared/interface";
import type {
  Category,
  CreateCategoryParams,
  UpdateCategoryParams,
  SubCategoryFormValues,
} from "./interface";

export function getCategories({ params }: { params: PaginationParams }) {
  return api.get("/categories", { params });
}

export function getCategoryById(categoryId: string) {
  return api.get<{ data: Category }>(`/categories/${categoryId}`);
}

export function createCategory(data: CreateCategoryParams) {
  const formData = new FormData();
  formData.append("name", data.name);
  if (data.description) formData.append("description", data.description);
  if (data.image) formData.append("image", data.image);
  if (data.subCategories?.length) {
    data.subCategories.forEach((sub, index) => {
      formData.append(`subCategories[${index}][name]`, sub.name);
      if (sub.description)
        formData.append(`subCategories[${index}][description]`, sub.description);
    });
  }
  if (data.subImages?.length) {
    data.subImages.forEach((file) => formData.append("subImages", file));
  }
  return api.post("/categories", formData);
}

export function addSubCategory({
  categoryId,
  data,
  image,
}: {
  categoryId: string;
  data: SubCategoryFormValues;
  image?: File;
}) {
  const formData = new FormData();
  formData.append("name", data.name);
  if (data.description) formData.append("description", data.description);
  if (image) formData.append("image", image);
  return api.post(`/categories/${categoryId}`, formData);
}

export function updateCategory({
  categoryId,
  data,
}: {
  categoryId: string;
  data: UpdateCategoryParams;
}) {
  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.description !== undefined) formData.append("description", data.description);
  if (data.isActive !== undefined) formData.append("isActive", String(data.isActive));
  if (data.image) formData.append("image", data.image);
  return api.patch(`/categories/${categoryId}`, formData);
}

export function updateSubCategory({
  categoryId,
  subCategoryId,
  data,
  image,
}: {
  categoryId: string;
  subCategoryId: string;
  data: UpdateCategoryParams;
  image?: File;
}) {
  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.description !== undefined) formData.append("description", data.description);
  if (data.isActive !== undefined) formData.append("isActive", String(data.isActive));
  if (image) formData.append("image", image);
  return api.patch(`/categories/${categoryId}/${subCategoryId}`, formData);
}

export function deleteCategory(categoryId: string) {
  return api.delete(`/categories/${categoryId}`);
}

export function deleteSubCategory(categoryId: string, subCategoryId: string) {
  return api.delete(`/categories/${categoryId}/${subCategoryId}`);
}
