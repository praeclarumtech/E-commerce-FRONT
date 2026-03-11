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
        items: raw.items,
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
    return api.post<UserResponse>('/users/add', payload);
}

export function updateUser(id: string, payload: Partial<UserPayload>) {
    return api.put<UserResponse>(`/users/${id}`, payload);
}

export function deleteUser(id: string) {
    return api.delete(`/users/${id}`);
}

/** Current user profile */
export function getProfile() {
  return api.get<{ data: ProfileResponse }>("/users/profile");
}

export type ProfileUpdatePayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type ProfileResponse = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: { _id: string; name?: string; isActive?: boolean };
  [key: string]: unknown;
};

/** Update current user profile */
export function updateProfile(payload: ProfileUpdatePayload) {
  return api.put<{ data: ProfileResponse }>("/users/profile", payload);
}

/** Change password (current user). Backend may use POST /users/change-password or similar. */
export function changePassword(payload: { currentPassword: string; newPassword: string }) {
  return api.post("/users/change-password", payload);
}