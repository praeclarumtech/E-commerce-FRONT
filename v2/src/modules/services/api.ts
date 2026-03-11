import api from "../../shared/api";
import type { PaginationParams } from "../../shared/interface";
import type { CreateServiceParams, UpdateServiceParams } from "./interface";

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
