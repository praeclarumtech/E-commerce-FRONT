import api from "../../shared/api";

export function getPaymentsByUser() {
    return api.get("/payments/user");
}

export function getPaymentById(paymentId: string) {
    return api.get(`/payments/${paymentId}`);
}
