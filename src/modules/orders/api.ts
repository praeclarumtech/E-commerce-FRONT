import api from "../../shared/api";
import { PaginationParams } from "../../shared/types";

export function getOrder({ params }: { params: PaginationParams }) {
    return api.get('/city', { params });
}