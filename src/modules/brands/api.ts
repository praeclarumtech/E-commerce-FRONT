import api from "../../shared/api";
import { PaginationParams } from "../../shared/types";
import { CreateBrandParams, UpdateBrandParams } from "./type";

export function getBrands({ params }: { params?: PaginationParams }) {
    return api.get("/brands", { params });
}

export function getBrandById(id: string) {
    return api.get(`/brands/${id}`);
}

function buildBrandFormData(payload: {
    brandName: string;
    description?: string;
    images?: File[];
    primaryImageIndex?: number;
}): FormData {
    const formData = new FormData();
    formData.append("brandName", payload.brandName);
    if (payload.description) formData.append("description", payload.description);
    if (payload.images?.length) {
        payload.images.forEach((file) => formData.append("images", file));
        if (payload.primaryImageIndex !== undefined && payload.primaryImageIndex >= 0) {
            formData.append("primaryImageIndex", String(payload.primaryImageIndex));
        }
    }
    return formData;
}

export function createBrand(data: CreateBrandParams | FormData) {
    if (data instanceof FormData) {
        return api.post("/brands", data);
    }
    return api.post("/brands", data);
}

export function updateBrand({ id, data }: { id: string; data: UpdateBrandParams | FormData }) {
    if (data instanceof FormData) {
        return api.put(`/brands/${id}`, data);
    }
    return api.put(`/brands/${id}`, data);
}

export { buildBrandFormData };

export function deleteBrand(id: string) {
    return api.delete(`/brands/${id}`);
}
