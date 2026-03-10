import type { AxiosResponse } from "axios";
import api from "../../shared/api";
import type { PaginationParams, PaginationResponse } from "../../shared/interface";

import type { RoleResponse } from "./interface";

export interface RolePayload {
    name: string;
    isActive: boolean;
    accessModules?: string[];
}

export function get({ params = {} }: { params?: PaginationParams } = {}):
    Promise<AxiosResponse<PaginationResponse<RoleResponse>>> {
    return api.get<PaginationResponse<RoleResponse>>('/roles', { params });
}

export function getRoleById(id: string) {
    return api.get<RoleResponse>(`/roles/${id}`);
}

export function createRole(payload: RolePayload) {
    return api.post<RoleResponse>('/roles', payload);
}

export function updateRole(id: string, payload: RolePayload) {
    return api.patch<RoleResponse>(`/roles/${id}`, payload);
}

export function deleteRole(id: string) {
    return api.delete(`/roles/${id}`);
}