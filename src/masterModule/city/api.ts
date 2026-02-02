import api from "../../shared/api";
import { PaginationParams } from "../../shared/types";
import { CityRequestData, cityResponseData, UpdateCity } from "./type";

export function createCiyt(data: CityRequestData) {
    return api.post<cityResponseData>('/city', data);
}

export function getCityById(id: string) {
    return api.get(`/city/${id}`);
}

export function getCity({ params }: { params: PaginationParams }) {
    return api.get('/city', { params });
}

export function UpdatedCity({ id, data }: {id: string, data: UpdateCity}) {
    return api.put<cityResponseData>(`/city/${id}`, data)
}

export function deleteCity(id: string) {
    return api.delete(`/city/${id}`);
}

export function getAllCity() {
    return api.get('/city', { params: { limit: 100 } });
}