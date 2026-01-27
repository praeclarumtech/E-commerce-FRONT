import api from "../../shared/api";
import { PaginationParams } from "../../shared/types";
import { CreateUserParams, UpdateUserParams, UserResponseData } from "./type";

export function getUsers({ params }: { params: PaginationParams }) {
    return api.get('/users', { params });
}

export function getUserById(id: string) {
    return api.get(`/users/${id}`);
}

export function createUser(data: CreateUserParams) {
    return api.post<UserResponseData>('/users', data);
}

export function updateUser({ id, data }: { id: string; data: UpdateUserParams }) {
    return api.put(`/users/${id}`, data);
}

export function deleteUser(id: string) {
    return api.delete(`/users/${id}`);
}