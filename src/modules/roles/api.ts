import api from "../../shared/api";
import { PaginationParams } from "../../shared/types";
import { CreateRoleParams, UpdateRoleParams, RoleResponseData } from "./type";

export function getRoles({ params }: { params: PaginationParams }) {
    return api.get('/roles', { params });
}

export function getRoleById(id: string) {
    return api.get(`/roles/${id}`);
}

export function createRole(data: CreateRoleParams) {
    return api.post<RoleResponseData>('/roles', data);
}

export function updateRole({ id, data }: { id: string; data: UpdateRoleParams }) {
    return api.put<RoleResponseData>(`/roles/${id}`, data);
}

export function deleteRole(id: string) {
    return api.delete(`/roles/${id}`);
}

export function hardDeleteRole(id: string) {
    return api.delete(`/roles/${id}/permanent`);
}

export function getAllRoles() {
    return api.get('/roles', { params: { limit: 100 } });
}