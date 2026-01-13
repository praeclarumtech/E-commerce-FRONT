import api from "../../shared/api";
import { PaginationParams } from "../../shared/types";

export function getUsers({ params }: { params: PaginationParams }) {
    return api.get('/users', { params });
}