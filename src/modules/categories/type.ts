export type SubCategory = {
    _id?: string;
    name: string;
    description?: string;
    image?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type CategoryUser = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
};

export type Category = {
    _id: string;
    name: string;
    description?: string;
    image?: string;
    isActive: boolean;
    userId?: CategoryUser | string;
    subCategories?: SubCategory[];
    createdAt: string;
    updatedAt: string;
};

export type CategoryFormValues = {
    name: string;
    description?: string;
    isActive?: boolean;
};

export type SubCategoryFormValues = {
    name: string;
    description?: string;
};

export type CreateCategoryParams = {
    name: string;
    description?: string;
    image?: File;
    subCategories?: SubCategoryFormValues[];
    subImages?: File[];
};

export type UpdateCategoryParams = {
    name?: string;
    description?: string;
    isActive?: boolean;
    image?: File;
};

export type CategoryListResponse = {
    items: Category[];
    page: number;
    totalPages: number;
    total: number;
};
