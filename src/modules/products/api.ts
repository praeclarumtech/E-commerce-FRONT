import api from "../../shared/api";
import { PaginationParams } from "../../shared/types";
import { 
    ProductResponseData, 
    Product 
} from "./type";

export function getProducts({ params }: { params: PaginationParams }) {
    return api.get('/products', { params });
}

export function getProductById(id: string) {
    return api.get<{ data: Product }>(`/products/${id}`);
}

type CreateProductParams = {
    categoryId: string;
    userId: string;
    name: string;
    description?: string;
    price: number;
    isActive?: boolean;
    status?: string;
    images?: File[];
};

export function createProduct(data: CreateProductParams) {
    const formData = new FormData();
    
    formData.append('categoryId', data.categoryId);
    formData.append('userId', data.userId);
    formData.append('name', data.name);
    formData.append('price', String(data.price));
    
    if (data.description) {
        formData.append('description', data.description);
    }
    if (data.isActive !== undefined) {
        formData.append('isActive', String(data.isActive));
    }
    if (data.status) {
        formData.append('status', data.status);
    }
    if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
            formData.append('images', image);
        });
    }

    return api.post<ProductResponseData>('/products', formData);
}

type UpdateProductParams = {
    id: string;
    data: {
        categoryId?: string;
        name?: string;
        description?: string;
        price?: number;
        isActive?: boolean;
        status?: string;
        images?: File[];
        removedImages: string[]
    };
};

export function updateProduct({ id, data }: UpdateProductParams) {
    const formData = new FormData();
    
    if (data.categoryId) {
        formData.append('categoryId', data.categoryId);
    }
    if (data.name) {
        formData.append('name', data.name);
    }
    if (data.price !== undefined) {
        formData.append('price', String(data.price));
    }
    if (data.description !== undefined) {
        formData.append('description', data.description);
    }
    if (data.isActive !== undefined) {
        formData.append('isActive', String(data.isActive));
    }
    if (data.status) {
        formData.append('status', data.status);
    }
    if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
            formData.append('images', image);
        });
    }

    return api.put<ProductResponseData>(`/products/${id}`, formData);
}

export function deleteProduct(id: string) {
    return api.delete(`/products/${id}`);
}

// Product Image Management
export function addProductImages(productId: string, images: File[]) {
    const formData = new FormData();
    images.forEach((image) => {
        formData.append('images', image);
    });
    return api.post(`/products/${productId}/images`, formData);
}

export function removeProductImage(productId: string, imageUrl: string) {
    return api.delete(`/products/${productId}/images`, {
        data: { imageUrl }
    });
}

export function setProductPrimaryImage(productId: string, imageUrl: string) {
    return api.patch(`/products/${productId}/images/primary`, { imageUrl });
}
