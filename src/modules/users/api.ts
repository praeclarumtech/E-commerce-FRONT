import api from "../../shared/api";
import { PaginationParams } from "../../shared/types";
import { AddUserRequestData, AddUserResponseData } from "./type";

export function getUsers({ params }: { params: PaginationParams }) {
    return api.get('/users', { params });
}

export function createUser(data: AddUserRequestData) {
    return api.post<AddUserResponseData>('/users', data);
}