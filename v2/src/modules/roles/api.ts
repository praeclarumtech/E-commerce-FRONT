import type { AxiosResponse } from "axios";
import api from "../../shared/api";
import type { PaginationParams, PaginationResponse } from "../../shared/interface";

import type { RoleResponse } from "./interface";

export function get({ params = {} }: { params?: PaginationParams } = {}):
    Promise<AxiosResponse<PaginationResponse<RoleResponse>>> {
    return api.get<PaginationResponse<RoleResponse>>('/roles', { params });
}

export function deleteRole(id: string) {
    return api.delete(`/roles/${id}`);
}