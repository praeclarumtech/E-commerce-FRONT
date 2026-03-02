import api from "../../shared/api";
import { PaginationParams } from "../../shared/types";
import { CreateServiceParams, UpdateServiceParams } from "./type";

export function getServices({ params }: { params?: PaginationParams }) {
    return api.get("/services", { params });
}

export function getServiceById(id: string) {
    return api.get(`/services/${id}`);
}

export function createService(data: CreateServiceParams) {
    return api.post("/services", data);
}

export function updateService(id: string, data: UpdateServiceParams) {
    return api.patch(`/services/${id}`, data);
}

export function deleteService(id: string) {
    return api.delete(`/services/${id}`);
}
