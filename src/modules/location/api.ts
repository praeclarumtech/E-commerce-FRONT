import api from "../../shared/api";
import { PaginationParams } from "../../shared/types";

const paginationParams = (params?: PaginationParams) => ({ params });

// Country
export function getCountries(args?: { params?: PaginationParams }) {
    return api.get("/country", paginationParams(args?.params));
}

export function getCountryById(id: string) {
    return api.get(`/country/${id}`);
}

export function createCountry(data: Record<string, unknown>) {
    return api.post("/country", data);
}

export function updateCountry(id: string, data: Record<string, unknown>) {
    return api.put(`/country/${id}`, data);
}

export function deleteCountry(id: string) {
    return api.delete(`/country/${id}`);
}

// State
export function getStates(args?: { params?: PaginationParams & { countryId?: string } }) {
    return api.get("/state", paginationParams(args?.params));
}

export function getStateById(id: string) {
    return api.get(`/state/${id}`);
}

export function createState(data: Record<string, unknown>) {
    return api.post("/state", data);
}

export function updateState(id: string, data: Record<string, unknown>) {
    return api.put(`/state/${id}`, data);
}

export function deleteState(id: string) {
    return api.delete(`/state/${id}`);
}

// City
export function getCities(args?: { params?: PaginationParams & { stateId?: string } }) {
    return api.get("/city", paginationParams(args?.params));
}

export function getCityById(id: string) {
    return api.get(`/city/${id}`);
}

export function createCity(data: Record<string, unknown>) {
    return api.post("/city", data);
}

export function updateCity(id: string, data: Record<string, unknown>) {
    return api.put(`/city/${id}`, data);
}

export function deleteCity(id: string) {
    return api.delete(`/city/${id}`);
}
