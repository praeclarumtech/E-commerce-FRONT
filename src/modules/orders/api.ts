import api from "../../shared/api";
import { PaginationParams } from "../../shared/types";

export function getOrders({ params }: { params?: PaginationParams }) {
    return api.get("/orders", { params });
}

export function getOrderById(orderId: string) {
    return api.get(`/orders/${orderId}`);
}

export function updateOrder(orderId: string, data: Record<string, unknown>) {
    return api.patch(`/orders/${orderId}`, data);
}
