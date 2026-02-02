import api from "../../shared/api";
import { PaginationParams } from "../../shared/types";
import { StateRequestData, stateResponseData, UpdateState } from "./type";

export function createState(data: StateRequestData) {
    return api.post<stateResponseData>('/state', data);
}

export function getStateById(id: string) {
    return api.get(`/state/${id}`);
}

export function getState({ params }: { params: PaginationParams }) {
    return api.get('/state', { params });
}

export function UpdatedState({ id, data }: {id: string, data: UpdateState}) {
    return api.put<stateResponseData>(`/state/${id}`, data)
}

export function deleteState(id: string) {
    return api.delete(`/state/${id}`);
}

export function getAllState() {
    return api.get('/state', { params: { limit: 100 } });
}

export function getStateByCountry(countryId: string) {
    return api.get(`/state/${countryId}`);
}