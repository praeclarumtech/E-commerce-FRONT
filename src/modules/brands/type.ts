export type BrandImage = {
    imageUrl: string;
    isPrimary?: boolean;
};

export type Brand = {
    _id: string;
    brandName?: string;
    description?: string;
    images?: BrandImage[];
    [key: string]: unknown;
};

export type CreateBrandParams = {
    brandName: string;
    description?: string;
    images?: BrandImage[];
};

export type UpdateBrandParams = {
    brandName?: string;
    description?: string;
    images?: BrandImage[];
};

export type BrandFormPayload = {
    brandName: string;
    description?: string;
    images?: File[];
    primaryImageIndex?: number;
};
