import type { AxiosResponse } from "axios";
import api from "../../shared/api";
import type { PaginationParams, PaginationResponse } from "../../shared/interface";

import type { UserResponse } from "./interface";

/** Raw API response: { items, total, page, limit, totalPages, hasNext, hasPrev } */
export interface UsersListApiResponse {
    items: UserResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

/** Shape passed to Table (matches PaginationResponse<T>["data"]) */
export type UsersListResponse = PaginationResponse<UserResponse>["data"];

export function normalizeUsersListResponse(raw: UsersListApiResponse): UsersListResponse {
    return {
        data: raw.items,
        page: raw.page,
        totalPages: raw.totalPages,
        total: raw.total,
        limit: raw.limit,
    };
}

export interface UserPayload {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender?: string | null;
    dob?: string | null;
    password?: string;
    roleId?: string;
    isActive: boolean;
}

export function get({ params = {} }: { params?: PaginationParams } = {}):
    Promise<AxiosResponse<UsersListApiResponse>> {
    return api.get<UsersListApiResponse>("/users", { params });
}

export function getUserById(id: string) {
    return api.get<UserResponse>(`/users/${id}`);
}

export function createUser(payload: UserPayload) {
    return api.post<UserResponse>('/users', payload);
}

export function updateUser(id: string, payload: Partial<UserPayload>) {
    return api.patch<UserResponse>(`/users/${id}`, payload);
}

export function deleteUser(id: string) {
    return api.delete(`/users/${id}`);
}
