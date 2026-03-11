import api from "../../shared/api";
import type { PaginationParams } from "../../shared/interface";
import type { CreateOfferParams, UpdateOfferParams } from "./interface";

export function getOffers({ params }: { params?: PaginationParams }) {
  return api.get("/offers", { params });
}

export function getOfferById(id: string) {
  return api.get(`/offers/${id}`);
}

export function createOffer(data: CreateOfferParams) {
  return api.post("/offers", data);
}

export function updateOffer({ id, data }: { id: string; data: UpdateOfferParams }) {
  return api.put(`/offers/${id}`, data);
}

export function deleteOffer(id: string) {
  return api.delete(`/offers/${id}`);
}
