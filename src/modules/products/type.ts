export enum ENUM_PRODUCT_STATUS {
    DRAFT = 'Draft',
    SAVED = 'Saved',
    PUBLISH = 'Publish',
}

export type ProductFormValues = {
    categoryId: string;
    subCategoryId: string;
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

export type ProductCategory = {
    _id: string;
    name: string;
    // isSubCategory?: boolean;
    // parentCategory?: {
    //     _id: string;
    //     name: string;
    // };
};

export type ProductSubCategory = {
    _id: string;
    name: string;
}
export type ProductUser = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
};

export type Product = {
    _id: string;
    categoryId: string | ProductCategory;
    subCategoryId: string | ProductSubCategory;
    userId: string | ProductUser;
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

// Variant Types
export type VariantImage = {
    _id?: string;
    imageUrl: string;
    isPrimary: boolean;
};

export type VariantAttributes = Record<string, string | number>;

export type Variant = {
    _id: string;
    productId: string;
    attributes: VariantAttributes;
    price: number;
    stock: number;
    images?: VariantImage[];
    isActive?: boolean;
    isDeleted?: boolean;
    createdAt: string;
    updatedAt: string;
};

export type CreateVariantParams = {
    productId: string;
    attributes: VariantAttributes;
    price?: number;
    stock?: number;
    images?: File[];
};

export type UpdateVariantParams = {
    variantId: string;
    data: {
        attributes?: VariantAttributes;
        price?: number;
        stock?: number;
        images?: File[];
    };
};

export type VariantFormValues = {
    attributes: { key: string; value: string }[];
    price: number;
    stock: number;
};
