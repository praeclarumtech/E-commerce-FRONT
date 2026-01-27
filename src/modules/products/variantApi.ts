import api from "../../shared/api";
import { Variant, CreateVariantParams, UpdateVariantParams } from "./type";

// Get all variants for a product
export function getVariantsByProduct(productId: string) {
    return api.get<{ data: Variant[] }>(`/variants/product/${productId}`);
}

// Get single variant
export function getVariantById(variantId: string) {
    return api.get<{ data: Variant }>(`/variants/${variantId}`);
}

// Create variant
export function createVariant(data: CreateVariantParams) {
    const formData = new FormData();
    
    formData.append('productId', data.productId);
    
    // Send attributes using bracket notation for proper parsing
    Object.entries(data.attributes).forEach(([key, value]) => {
        formData.append(`attributes[${key}]`, String(value));
    });
    
    if (data.price !== undefined) {
        formData.append('price', String(data.price));
    }
    if (data.stock !== undefined) {
        formData.append('stock', String(data.stock));
    }
    if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
            formData.append('images', image);
        });
    }

    return api.post<{ data: Variant }>('/variants', formData);
}

// Update variant
export function updateVariant({ variantId, data }: UpdateVariantParams) {
    const formData = new FormData();
    
    // Send attributes using bracket notation for proper parsing
    if (data.attributes) {
        Object.entries(data.attributes).forEach(([key, value]) => {
            formData.append(`attributes[${key}]`, String(value));
        });
    }
    if (data.price !== undefined) {
        formData.append('price', String(data.price));
    }
    if (data.stock !== undefined) {
        formData.append('stock', String(data.stock));
    }
    if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
            formData.append('images', image);
        });
    }

    return api.patch<{ data: Variant }>(`/variants/${variantId}`, formData);
}

// Soft delete variant
export function deleteVariant(variantId: string) {
    return api.delete(`/variants/${variantId}`);
}

// Hard delete variant
export function hardDeleteVariant(variantId: string) {
    return api.delete(`/variants/${variantId}/permanent`);
}

// Add images to variant
export function addVariantImages(variantId: string, images: File[]) {
    const formData = new FormData();
    images.forEach((image) => {
        formData.append('images', image);
    });
    return api.post(`/variants/${variantId}/images`, formData);
}

// Remove image from variant
export function removeVariantImage(variantId: string, imageUrl: string) {
    return api.delete(`/variants/${variantId}/images`, {
        params: { imageUrl }
    });
}

// Set primary image
export function setVariantPrimaryImage(variantId: string, imageUrl: string) {
    return api.patch(`/variants/${variantId}/images/primary`, { imageUrl });
}
