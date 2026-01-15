export enum ENUM_PRODUCT_STATUS {
    DRAFT = 'Draft',
    SAVED = 'Saved',
    PUBLISH = 'Publish',
}

export type ProductFormValues = {
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    isActive?: boolean;
    status?: ENUM_PRODUCT_STATUS;
    images?: File[];
};

export type CreateProductRequestData = ProductFormValues & {
    userId: string;
};

export type UpdateProductRequestData = Partial<ProductFormValues>;

export type ProductResponseData = {
    data: {
        productId: string;
    };
};

export type Product = {
    _id: string;
    categoryId: string;
    userId: string;
    name: string;
    description?: string;
    price: number;
    isActive: boolean;
    status: ENUM_PRODUCT_STATUS;
    images?: string[];
    createdAt: string;
    updatedAt: string;
};

export type ProductListResponse = {
    items: Product[];
    page: number;
    totalPages: number;
    total: number;
};
