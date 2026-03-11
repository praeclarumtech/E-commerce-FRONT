import api from "../../shared/api";
import type { PaginationParams } from "../../shared/interface";
import type { Brand } from "./interface";

export function getBrands({ params }: { params?: PaginationParams }) {
  return api.get("/brands", { params });
}

export function getBrandById(id: string) {
  return api.get<{ data: Brand }>(`/brands/${id}`);
}

function buildBrandFormData(payload: {
  brandName: string;
  description?: string;
  images?: File[];
}): FormData {
  const formData = new FormData();
  formData.append("brandName", payload.brandName);
  if (payload.description) formData.append("description", payload.description);
  if (payload.images?.length) {
    payload.images.forEach((file) => formData.append("images", file));
  }
  return formData;
}

export function createBrand(data: FormData) {
  return api.post("/brands", data);
}

export function updateBrand({
  id,
  data,
}: {
  id: string;
  data: FormData | { brandName?: string; description?: string };
}) {
  if (data instanceof FormData) {
    return api.put(`/brands/${id}`, data);
  }
  return api.put(`/brands/${id}`, data);
}

export { buildBrandFormData };

export function deleteBrand(id: string) {
  return api.delete(`/brands/${id}`);
}
