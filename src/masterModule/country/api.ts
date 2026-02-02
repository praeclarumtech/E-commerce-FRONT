import api from "../../shared/api";
import { PaginationParams } from "../../shared/types";
import { CountryRequestData, CountryResponseData, UpdateCountry } from "./type";

export function createCountry(data: CountryRequestData) {
    return api.post<CountryResponseData>('/country', data);
}

export function getCountryById(id: string) {
    return api.get(`/country/${id}`);
}

export function getCountry({ params }: { params: PaginationParams }) {
    return api.get('/country', { params });
}

export function UpdatedCountry({ id, data }: {id: string, data: UpdateCountry}) {
    return api.put<CountryResponseData>(`/country/${id}`, data)
}

export function deleteCountry(id: string) {
    return api.delete(`/country/${id}`);
}

export function getAllCountry() {
    return api.get('/country', { params: { limit: 100 } });
}