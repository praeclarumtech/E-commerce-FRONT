import api from "../../shared/api";

export function getInventoryByVariant(variantId: string) {
  return api.get(`/inventory/${variantId}`);
}

export function reserveInventory(variantId: string, data: { quantity: number }) {
  return api.post(`/inventory/${variantId}/reserve`, data);
}

export function releaseInventory(variantId: string, data: { quantity: number }) {
  return api.post(`/inventory/${variantId}/release`, data);
}

export function deductInventory(variantId: string, data: { quantity: number }) {
  return api.post(`/inventory/${variantId}/deduct`, data);
}
